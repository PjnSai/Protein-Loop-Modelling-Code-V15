# utils.py - Security and Communication Utilities
from flask import jsonify, session
import requests, time, smtplib
from email.message import EmailMessage
from functools import wraps
from flask import current_app as app
from models import LoginLog, db
from logging_config import logger

# Security configuration constants
MAX_FAILED_ATTEMPTS = 5    # Maximum failed login attempts before lockout
LOCKOUT_TIME = 600         # Account lockout duration in seconds (10 minutes)

def require_auth(f):
    """Authentication Required Decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
            
        return f(*args, **kwargs)
    return decorated_function

def is_pwned(password):
    """Check if password appears in known data breaches"""
    try:
        import hashlib

        # Generate SHA-1 hash of password
        sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
        prefix, suffix = sha1[:5], sha1[5:]
        
        # Query HaveIBeenPwned API with hash prefix only
        response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        
        if response.status_code == 200:
            return suffix in response.text
        else:
            logger.warning(f"HaveIBeenPwned API error: {response.status_code}")
            return False
            
    except Exception as e:
        logger.warning(f"Password breach check failed: {e}")
        return False

def is_locked(user):
    """Check if user account is temporarily locked due to failed attempts"""
    if user.failed_attempts >= MAX_FAILED_ATTEMPTS:
        if time.time() - user.last_failed < LOCKOUT_TIME:
            return True  # Still locked
        else:
            # Lockout expired - reset failed attempts counter
            user.failed_attempts = 0
            db.session.commit()
            logger.info(f"Account lockout expired for user: {user.email}")
    
    return False

def check_password_strength(password):
    """Validate password strength using zxcvbn"""
    try:
        from zxcvbn import zxcvbn
        
        result = zxcvbn(password)
        score = result['score']
        
        # Require score of 3 or higher (moderate to strong protection)
        is_strong = score >= 3
        
        if not is_strong:
            logger.info(f"Weak password rejected: score {score}/4")
            
        return is_strong
        
    except ImportError:
        logger.warning("zxcvbn not available, using basic password checking")
        return len(password) >= 8

def send_email(email, subject, content):
    """Send email using SMTP with authentication"""
    try:
        msg = EmailMessage()
        msg.set_content(content)
        msg["Subject"] = subject
        msg["From"] = app.config['MAIL_SENDER']
        msg["To"] = email
        
        # Connect to Gmail SMTP server with SSL encryption
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(app.config['MAIL_SENDER'], app.config['MAIL_PASSWORD'])
            server.send_message(msg)
            
        logger.info(f"Email sent successfully to: {email}")
        return True
        
    except Exception as e:
        logger.error(f"Email send error to {email}: {e}")
        return False

def log_event(email, action, status, ip):
    """Log user activities and security events for monitoring and audit trails"""
    try:
        log = LoginLog(
            email=email, 
            action=action, 
            status=status, 
            ip=ip, 
            timestamp=time.time()
        )
        
        db.session.add(log)
        db.session.commit()
        
        logger.debug(f"Security event logged: {email} - {action} - {status}")
        
    except Exception as e:
        logger.error(f"Failed to log security event: {e}")
        try:
            db.session.rollback()
        except:
            pass