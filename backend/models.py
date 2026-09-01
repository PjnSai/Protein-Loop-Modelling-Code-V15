# models.py - SQLAlchemy Database Models for Protein Loop Modelling System
from datetime import timedelta, datetime
from extensions import db, bcrypt

class User(db.Model):
    """User Model - Represents a user account in the system""" 

    # Primary key and authentication fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Security and login tracking
    failed_attempts = db.Column(db.Integer, default=0)
    last_failed = db.Column(db.Float, default=0.0)
    
    # One-Time Password for secure login
    otp_code = db.Column(db.String(6), nullable=True)
    otp_sent_time = db.Column(db.Float, nullable=True)
    
    # Password reset functionality
    reset_token = db.Column(db.String(64), nullable=True)
    reset_expiry = db.Column(db.Float, nullable=True)
    
    # Account creation tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # User profile information (optional fields)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    institution = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def set_password(self, password):
        """Hash and store user password securely"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verify user password against stored hash"""
        return bcrypt.check_password_hash(self.password_hash, password)

class LoginLog(db.Model):
    """LoginLog Model - Records user authentication events"""
    
    # Primary key and user identification
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120))  # Email of user (may not exist if registration failed)
    
    # Request context
    ip = db.Column(db.String(45))      # IP address (supports IPv6)
    
    # Action tracking
    action = db.Column(db.String(50))  # What was attempted (login, register, etc.)
    status = db.Column(db.String(20))  # Result (success, failed, expired, etc.)
    
    # Timing
    timestamp = db.Column(db.Float)    # When event occurred (Unix timestamp)

class ModellingJob(db.Model):
    """ModellingJob Model - Represents a protein loop modelling computation"""
    
    # Primary key and job identification
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(64), unique=True, nullable=False)  # UUID for external reference
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Link to user account
    
    # Protein structure parameters
    pdb_code = db.Column(db.String(4), nullable=False)     # 4-character PDB identifier
    chain = db.Column(db.String(1), nullable=False)        # Protein chain identifier
    segment_start = db.Column(db.Integer, nullable=False)   # Starting residue number
    segment_end = db.Column(db.Integer, nullable=False)     # Ending residue number
    
    # MATLAB parameters (stored as JSON string)
    parameters = db.Column(db.Text, nullable=False)        # Full parameter set for MATLAB
    
    # Job execution tracking
    status = db.Column(db.String(20), default='queued')    # Current job status
    # Possible status values: 'queued', 'running', 'completed', 'failed', 'cancelled'
    
    # Timing information
    created_at = db.Column(db.DateTime, default=datetime.utcnow)     # When job was submitted
    started_at = db.Column(db.DateTime, nullable=True)              # When MATLAB execution began
    completed_at = db.Column(db.DateTime, nullable=True)            # When job finished
    processing_time = db.Column(db.Float, nullable=True)            # Total execution time in seconds
    
    # File storage and results
    result_file_path = db.Column(db.String(255), nullable=True)     # Path to output PDB file
    pdb_content = db.Column(db.Text, nullable=True)                 # Original protein structure
    final_model_pdb = db.Column(db.Text, nullable=True)             # Final modelled structure
    results_data = db.Column(db.Text, nullable=True)                # MATLAB results as JSON string
    error_message = db.Column(db.Text, nullable=True)               # Error details if job failed