# auth_routes.py - Authentication and Session Management
from flask import request, jsonify, session
import time, random, string
from utils import send_email, log_event, is_pwned, check_password_strength, is_locked
from models import db, User
from logging_config import logger
from modelling_utils import create_error_response

def session_check():
    """Debug route to check session status"""
    return jsonify({'session_id': session.get('user_id'), 'session_keys': list(session.keys()), 'is_permanent': session.permanent, 'cookies': dict(request.cookies)})

def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return create_error_response('Email and password required')
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return create_error_response('Email already registered')

        # Check password against known breaches
        if is_pwned(data['password']):
            return create_error_response('Password found in data breaches. Please choose a different password.')

        # Check password strength
        if not check_password_strength(data['password']):
            return create_error_response('Password too weak. Use a longer or more complex password.')

        # Create new user with hashed password
        user = User(email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        
        # Log successful registration
        log_event(data['email'], 'register', 'success', request.remote_addr)
        
        return jsonify({'message': 'Registered successfully'})
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return create_error_response('Registration failed', 500)

def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return create_error_response('Email and password required')
        
        user = User.query.filter_by(email=data['email']).first()

        # Check if account is locked due to failed attempts
        if user and is_locked(user):
            log_event(data['email'], 'login', 'locked', request.remote_addr)
            return create_error_response('Account temporarily locked. Try again later.', 403)

        # Validate credentials
        if user and user.check_password(data['password']):
            # Generate 6-digit OTP code
            code = ''.join(random.choices(string.digits, k=6))
            user.otp_code = code
            user.otp_sent_time = time.time()
            user.failed_attempts = 0  # Reset failed attempts on successful login
            db.session.commit()
            
            # Send OTP email
            if send_email(user.email, "Your OTP Code", f"Your OTP code is: {code}"):
                log_event(user.email, 'login', 'otp-sent', request.remote_addr)
                return jsonify({'message': 'OTP sent to your email'})
            else:
                return create_error_response('Failed to send OTP. Please try again.', 500)

        # Handle failed login - increment failed attempts
        if user:
            user.failed_attempts += 1
            user.last_failed = time.time()
            db.session.commit()
            log_event(data['email'], 'login', 'failed', request.remote_addr)
        else:
            log_event(data['email'], 'login', 'failed', request.remote_addr)

        return create_error_response('Invalid email or password', 401)
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return create_error_response('Login failed', 500)

def verify_otp():
    """OTP verification endpoint with session management"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('otp'):
            return create_error_response('Email and OTP required')
        
        user = User.query.filter_by(email=data['email']).first()

        if user and user.otp_code == data['otp']:
            # Check OTP hasn't expired (5 minute time limit)
            if time.time() - user.otp_sent_time < 300:
                # Create secure session
                session.permanent = True
                session['user_id'] = user.id
                session['user_email'] = user.email
                session['login_time'] = time.time()
                session.modified = True  # Force session save
                
                # Clear OTP after successful verification
                user.otp_code = None
                user.otp_sent_time = None
                db.session.commit()
                
                log_event(user.email, 'otp-verify', 'success', request.remote_addr)
                
                return jsonify({
                    'message': 'OTP verified, login complete',
                    'user': {
                        'email': user.email,
                        'id': user.id
                    }
                })
            else:
                log_event(data['email'], 'otp-verify', 'expired', request.remote_addr)
                return create_error_response('OTP has expired. Please login again.', 401)
        
        log_event(data['email'], 'otp-verify', 'failed', request.remote_addr)
        return create_error_response('Invalid OTP', 401)
        
    except Exception as e:
        logger.error(f"OTP verification error: {e}")
        return create_error_response('OTP verification failed', 500)
    
def logout():
    """User logout endpoint"""
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            log_event(user.email, 'logout', 'success', request.remote_addr)
    
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

def auth_resend_otp():
    """Resend OTP for a pending login"""
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return create_error_response('Email required')

    user = User.query.filter_by(email=email).first()
    if user:
        # Generate and email new OTP code
        code = ''.join(random.choices(string.digits, k=6))
        user.otp_code = code
        user.otp_sent_time = time.time()
        db.session.commit()
        send_email(user.email, "Your new OTP", f"Your code is {code}")
        log_event(user.email, 'resend-otp', 'success', request.remote_addr)

    # Always return success to prevent email enumeration
    return jsonify({'message':'If that email is registered, a new OTP has been sent.'}), 200