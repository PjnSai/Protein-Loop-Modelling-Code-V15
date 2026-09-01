# password_routes.py - Password Management System
from flask import request, jsonify, session
from models import db, User
from utils import send_email, log_event, is_pwned, check_password_strength, require_auth
from modelling_utils import create_error_response
import time, random, string
from logging_config import logger

def request_reset():
    """Password Reset Request Endpoint"""
    try:
        data = request.get_json()
        
        # Validate request contains email address
        if not data or not data.get('email'):
            return create_error_response('Email required')
        
        # Retrieve user account (if exists)
        user = User.query.filter_by(email=data['email']).first()
        
        # Process reset request for existing users only 
        if user:
            # Generate cryptographically secure reset token
            token = ''.join(random.choices(
                string.ascii_letters + string.digits, 
                k=48
            ))
            
            # Store token with 10-minute expiration
            user.reset_token = token
            user.reset_expiry = time.time() + 600  # 10 minutes from now
            db.session.commit()

            # Construct reset link for email
            reset_link = f"http://localhost:5173/reset-password?token={token}&email={user.email}"
            
            # Send reset email with clear instructions
            email_sent = send_email(
                user.email, 
                "Password Reset Request", 
                f"Click the following link to reset your password:\n\n{reset_link}\n\n"
                f"This link will expire in 10 minutes for security.\n\n"
                f"If you did not request this reset, please ignore this email."
            )
            
            if email_sent:
                log_event(user.email, 'reset-request', 'sent', request.remote_addr)
            else:
                log_event(user.email, 'reset-request', 'failed', request.remote_addr)
        
        # Always return generic success message to prevent email enumeration
        return jsonify({
            'message': 'If this email exists, a reset link has been sent.'
        })
        
    except Exception as e:
        logger.error(f"Password reset request error: {e}")
        return create_error_response('Password reset request failed', 500)

def reset_password():
    """Password Reset Completion Endpoint"""
    try:
        data = request.get_json()
        
        # Validate all required parameters present
        required_fields = ['email', 'token', 'password']
        if not data or not all(k in data for k in required_fields):
            return create_error_response('Email, token, and password required')
        
        # Locate user account with matching email and token
        user = User.query.filter_by(email=data['email'], reset_token=data['token']).first()
        
        # Validate token exists and hasn't expired
        if not user or time.time() > user.reset_expiry:
            log_event(data['email'], 'reset-complete', 'invalid-token', request.remote_addr)
            return create_error_response('Invalid or expired reset token')

        # Security validation: Check password against known breaches
        if is_pwned(data['password']):
            return create_error_response(
                'Password found in data breaches. Please choose a different password.'
            )

        # Security validation: Enforce password strength requirements
        if not check_password_strength(data['password']):
            return create_error_response(
                'Password too weak. Please use a longer or more complex password.'
            )

        # Update password with secure hashing
        user.set_password(data['password'])  # Uses bcrypt internally
        
        # Invalidate reset token (single-use security)
        user.reset_token = None
        user.reset_expiry = None
        
        # Commit all changes atomically
        db.session.commit()
        
        # Log successful password reset
        log_event(user.email, 'reset-complete', 'success', request.remote_addr)
        
        return jsonify({'message': 'Password reset successfully'})
        
    except Exception as e:
        logger.error(f"Password reset error: {e}")
        return create_error_response('Password reset failed', 500)

@require_auth
def change_password():
    """Allow authenticated user to change their password"""
    data = request.get_json() or {}
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    # Validate both passwords provided
    if not current_password or not new_password:
        return create_error_response('Both current and new passwords are required')

    # Retrieve current user from authenticated session
    user = User.query.get(session['user_id'])
    
    # Verify current password is correct
    if not user.check_password(current_password):
        return create_error_response('Current password is incorrect')

    # Security validation: Check new password against known breaches
    if is_pwned(new_password):
        return create_error_response('New password found in known breaches')
    
    # Security validation: Enforce password strength requirements
    if not check_password_strength(new_password):
        return create_error_response('New password is too weak')

    # Update password with secure hashing
    user.set_password(new_password)
    db.session.commit()
    
    # Log successful password change
    log_event(user.email, 'change-password', 'success', request.remote_addr)
    
    return jsonify({'message': 'Password changed successfully'}), 200