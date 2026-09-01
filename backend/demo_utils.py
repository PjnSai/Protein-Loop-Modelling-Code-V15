# demo_utils.py - Demo Job Management Utilities
import os, uuid
from datetime import datetime, timedelta
from logging_config import logger

DEMO_JOB_DIR = "demo_jobs"
os.makedirs(DEMO_JOB_DIR, exist_ok=True)

class DemoJobManager:
    """Manage demo jobs without database persistence for Temporary Modelling Jobs"""
    def __init__(self):
        self.demo_jobs = {}  # In-memory storage for demo jobs
        self.job_counter = 0
    
    def create_demo_job(self, pdb_code, parameters):
        """Create a new demo modelling job"""
        self.job_counter += 1
        job_id = f"demo_{uuid.uuid4().hex[:8]}_{self.job_counter}"
        
        demo_job = {
            'job_id': job_id,
            'pdb_code': pdb_code.upper(),
            'parameters': parameters,
            'status': 'demo_queued',
            'created_at': datetime.utcnow().isoformat(),
            'demo_mode': True,
            'expires_at': (datetime.utcnow() + timedelta(hours=24)).isoformat()
        }
        
        self.demo_jobs[job_id] = demo_job
        return demo_job
    
    def get_demo_job(self, job_id):
        """Retrieve demo job by id"""
        job = self.demo_jobs.get(job_id)
        
        if job:
            # Check if job has expired
            expires_at = datetime.fromisoformat(job['expires_at'])
            if datetime.utcnow() > expires_at:
                # Job expired - remove and return None
                del self.demo_jobs[job_id]
                logger.info(f"Demo job {job_id} expired and removed")
                return None
            
            return job
        
        return None
    
    def update_demo_job(self, job_id, updates):
        """Update demo job with new information"""
        if job_id in self.demo_jobs:
            # Check expiration before updating
            job = self.demo_jobs[job_id]
            expires_at = datetime.fromisoformat(job['expires_at'])
            
            if datetime.utcnow() > expires_at:
                # Job expired - remove and return None
                del self.demo_jobs[job_id]
                logger.info(f"Demo job {job_id} expired during update")
                return None
            
            # Apply updates to job record
            self.demo_jobs[job_id].update(updates)
            return self.demo_jobs[job_id]
        
        return None
    
    def cleanup_expired_demo_jobs(self):
        """Remove expired demo jobs from memory"""
        now = datetime.utcnow()
        expired_jobs = []
        
        # Identify expired jobs
        for job_id, job in self.demo_jobs.items():
            try:
                expires_at = datetime.fromisoformat(job['expires_at'])
                if now > expires_at:
                    expired_jobs.append(job_id)
            except (ValueError, KeyError) as e:
                # Malformed job data - mark for removal
                logger.warning(f"Malformed job data for {job_id}: {e}")
                expired_jobs.append(job_id)
        
        # Remove expired jobs
        for job_id in expired_jobs:
            try:
                del self.demo_jobs[job_id]
            except KeyError:
                pass  # Job already removed
        
        if expired_jobs:
            logger.info(f"Demo job cleanup: {len(expired_jobs)} expired jobs removed")

# Create shared instance for application use
demo_job_manager = DemoJobManager()

def cleanup_expired_demo_jobs():
    """Periodic cleanup function for expired demo jobs"""
    try:
        demo_job_manager.cleanup_expired_demo_jobs()
        logger.info("Demo job cleanup completed")
    except Exception as e:
        logger.error(f"Demo job cleanup failed: {e}")