# app.py - Main Flask Application Entry Point
from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
import atexit
from datetime import timedelta
from dotenv import load_dotenv

# Import route handlers organised by functionality
from auth_routes import register, login, verify_otp, logout, auth_resend_otp, session_check
import os
from utils import require_auth
from extensions import db, bcrypt
from dashboard_routes import dashboard, get_user_jobs, get_dashboard_statistics, get_job_details
from password_routes import change_password, request_reset, reset_password
from profile_routes import get_profile, get_user_logs, update_profile, delete_user_logs
from context import pdb_manager, matlab_available
from modelling_routes import submit_modelling_job, download_job_results, cancel_job, delete_job, fetch_pdb_structure, modelling_system_status, get_job_with_results
from demo_routes import demo_search_pdb, demo_fetch_pdb, demo_prepare_modelling, demo_submit_modelling, demo_job_download
from demo_utils import cleanup_expired_demo_jobs
from logging_config import logger

# Load environment variables from .env file
load_dotenv()

# Create Flask application instance
app = Flask(__name__)

# Configure CORS to allow React frontend communication
CORS(app, 
     supports_credentials=True,  # Allow cookies for session management
     origins=[
         'http://localhost:5173', 'http://localhost:5174',  # Vite dev servers
         'http://127.0.0.1:5173', 'http://127.0.0.1:5174',
         'http://localhost:3000', 'http://localhost:3001'   # Alternative dev ports
     ])

# Application Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')  # PostgreSQL connection
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on disk
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)  # Auto-logout after 30 minutes
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Security: prevent JavaScript access to cookies
app.config['SESSION_COOKIE_SECURE'] = False   # Set to True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
app.config['SESSION_COOKIE_NAME'] = 'protein_session'
app.config['SESSION_COOKIE_DOMAIN'] = None

# Email Configuration for OTP system
app.config['MAIL_SENDER'] = os.environ.get('MAIL_SENDER')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['OTP_EXPIRY'] = 300  # OTP codes expire after 5 minutes
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB file upload limit

# Initialise Flask extensions
Session(app)     # Enable session management
db.init_app(app) # Connect to PostgreSQL database
bcrypt.init_app(app)  # Enable password hashing

# Register cleanup function to run when application shuts down
atexit.register(cleanup_expired_demo_jobs)

# Authentication routes
@app.route('/auth/register', methods=['POST'])
def register_route():
    """User registration endpoint"""
    return register()

@app.route('/auth/login', methods=['POST'])
def login_route():
    """User login endpoint"""
    return login()

@app.route('/auth/verify-otp', methods=['POST'])
def verify_otp_route():
    """OTP verification endpoint"""
    return verify_otp()

@app.route('/auth/logout', methods=['POST'])
def logout_route():
    """User logout endpoint"""
    return logout()

@app.route('/auth/resend-otp', methods=['POST'])
def resend_otp_route():
    """Resend OTP endpoint"""
    return auth_resend_otp()

@app.route('/auth/session-check', methods=['GET'])
def session_check_route():
    """Check if user is currently logged in"""
    return session_check()

# Password management routes
@app.route('/auth/change-password', methods=['POST'])
def change_password_route():
    """Change password for logged-in users"""
    return change_password()

@app.route('/auth/request-reset', methods=['POST'])
def request_reset_route():
    """Request password reset"""
    return request_reset()

@app.route('/auth/reset-password', methods=['POST'])
def reset_password_route():
    """Complete password reset using reset token"""
    return reset_password()

# Dashboard routes
@app.route('/dashboard', methods=['GET'])
def dashboard_route():
    """Main dashboard"""
    return dashboard()

@app.route('/api/dashboard/statistics', methods=['GET'])
def dashboard_stats_route():
    """Get user's modelling statistics"""
    return get_dashboard_statistics()

@app.route('/api/dashboard/jobs', methods=['GET'])
def dashboard_jobs_route():
    """Get paginated list of user's modelling jobs"""
    return get_user_jobs()

@app.route('/api/dashboard/job/<job_id>', methods=['GET'])
def dashboard_job_detail_route(job_id):
    """Get detailed information about a specific job"""
    return get_job_details(job_id)

# User profile routes
@app.route('/api/profile', methods=['GET'])
def get_profile_route():
    """Get user profile information"""
    return get_profile()

@app.route('/api/profile', methods=['PUT'])
def update_profile_route():
    """Update user profile information"""
    return update_profile()

@app.route('/api/logs', methods=['GET'])
def get_user_logs_route():
    """Get user activity logs"""
    return get_user_logs()

@app.route('/api/logs/delete', methods=['DELETE'])
def delete_user_logs_route():
    """Delete user activity logs"""
    return delete_user_logs()

# Modelling routes (require authentication)
@app.route('/api/modelling/submit', methods=['POST'])
def submit_modelling_job_route():
    """Submit a new protein loop modelling job"""
    return submit_modelling_job()

@app.route('/api/modelling/job/<job_id>/download', methods=['GET'])
def download_job_results_route(job_id):
    """Download modelling results as PDB file"""
    return download_job_results(job_id)

@app.route('/api/modelling/job/<job_id>/cancel', methods=['DELETE'])
def cancel_job_route(job_id):
    """Cancel a running modelling job"""
    return cancel_job(job_id)

@app.route('/api/modelling/job/<job_id>/delete', methods=['DELETE'])
def delete_job_route(job_id):
    """Delete a completed modelling job"""
    return delete_job(job_id)

@app.route('/api/modelling/job/<job_id>/details', methods=['GET'])
@require_auth
def get_job_with_results_route(job_id):
    """Get job details with modelled structure for visualisation"""
    return get_job_with_results(job_id)

@app.route('/api/pdb/fetch/<pdb_code>', methods=['GET'])
def fetch_pdb_structure_route(pdb_code):
    """Fetch protein structure from RCSB Protein Data Bank"""
    return fetch_pdb_structure(pdb_code)

@app.route('/api/modelling/status', methods=['GET'])
def modelling_system_status_route():
    """Check if MATLAB and modelling system are available"""
    return modelling_system_status()

# Demo routes (no authentication required)
@app.route('/api/demo/pdb/search', methods=['GET'])
def demo_search_pdb_route():
    """Demo protein search"""
    return demo_search_pdb()

@app.route('/api/demo/pdb/fetch/<pdb_code>', methods=['GET', 'OPTIONS'])
def demo_fetch_pdb_route(pdb_code):
    """Demo protein fetch"""
    return demo_fetch_pdb(pdb_code)

@app.route('/api/demo/modelling/prepare', methods=['POST', 'OPTIONS'])
def demo_prepare_modelling_route():
    """Demo modelling preparation"""
    return demo_prepare_modelling()

@app.route('/api/demo/modelling/submit', methods=['POST', 'OPTIONS'])
def demo_submit_modelling_route():
    """Demo modelling submission"""
    return demo_submit_modelling()

@app.route('/api/demo/job/<job_id>/download', methods=['GET', 'OPTIONS'])
def demo_job_download_route(job_id):
    """Download demo job results"""
    return demo_job_download(job_id)

# Error handlers
@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()  # Prevent database corruption
    return jsonify({'error': 'Internal server error'}), 500

# Application startup
if __name__ == '__main__':
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
        logger.info("Database tables created")
        
        # Display startup information for development
        print("Protein Loop Modelling Server")
        print("Database: Connected")
        print(f"MATLAB: {'Available' if matlab_available else 'Not available'}")
        print("Server: http://localhost:8000")
        print("Frontend: http://localhost:5173")
        print("\nReady to accept connections!")
    
    # Start the Flask development server
    app.run(debug=True, host='127.0.0.1', port=8000)