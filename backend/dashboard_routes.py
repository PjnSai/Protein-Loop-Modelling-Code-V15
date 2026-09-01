# dashboard_routes.py - User Dashboard and Analytics
from flask import request, jsonify, session
from models import db, User, ModellingJob
from utils import require_auth
from pathlib import Path
import json
from logging_config import logger
from modelling_utils import create_error_response

try:
    import matlab.engine
    matlab_available = True
except ImportError:
    matlab_available = False

# Dashboard endpoints for authenticated users
@require_auth
def dashboard():
    """Main dashboard endpoint returning user information and session status"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return create_error_response('Not logged in', 401)

        user = User.query.get(user_id)
        if not user:
            return create_error_response('User not found', 404)

        return jsonify({
            'email': user.email,
            'session_info': {
                'user_id': user_id,
                'login_time': session.get('login_time'),
                'session_keys': list(session.keys())
            }
        })
    except Exception as e:
        return create_error_response(f'Dashboard error: {str(e)}', 500)

@require_auth
def get_user_jobs():
    """Get paginated list of user's modelling jobs"""
    try:
        user_id = session.get('user_id')
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        jobs_query = ModellingJob.query.filter_by(user_id=user_id).order_by(ModellingJob.created_at.desc())
        jobs_paginated = jobs_query.paginate(page=page, per_page=per_page, error_out=False)
        
        jobs_list = []
        for job in jobs_paginated.items:
            job_data = {
                'id': job.id,
                'job_id': job.job_id,
                'pdb_code': job.pdb_code,
                'chain': job.chain,
                'segment_start': job.segment_start,
                'segment_end': job.segment_end,
                'status': job.status,
                'created_at': job.created_at.isoformat(),
                'has_results': bool(job.result_file_path)
            }
            
            if job.completed_at:
                job_data['completed_at'] = job.completed_at.isoformat()
            if job.processing_time:
                job_data['processing_time'] = job.processing_time
                
            jobs_list.append(job_data)
        
        return jsonify({
            'jobs': jobs_list,
            'page': page,
            'pages': jobs_paginated.pages,
            'per_page': per_page,
            'total': jobs_paginated.total,
            'has_next': jobs_paginated.has_next,
            'has_prev': jobs_paginated.has_prev
        })
        
    except Exception as e:
        return create_error_response(f'Failed to get jobs: {str(e)}', 500)

@require_auth
def get_dashboard_statistics():
    """Get user's modelling statistics and recent activity"""
    try:
        user_id = session.get('user_id')
        
        # Get job counts by status
        stats = db.session.query(
            ModellingJob.status,
            db.func.count(ModellingJob.id).label('count')
        ).filter_by(user_id=user_id).group_by(ModellingJob.status).all()
        
        status_counts = {status: count for status, count in stats}
        
        # Get recent job activity
        recent_jobs = ModellingJob.query.filter_by(user_id=user_id)\
            .order_by(ModellingJob.created_at.desc())\
            .limit(5).all()
        
        recent_activity = []
        for job in recent_jobs:
            recent_activity.append({
                'job_id': job.job_id,
                'pdb_code': job.pdb_code,
                'status': job.status,
                'created_at': job.created_at.isoformat()
            })
        
        # Calculate success rate
        total_completed = status_counts.get('completed', 0) + status_counts.get('failed', 0)
        success_rate = (status_counts.get('completed', 0) / total_completed * 100) if total_completed > 0 else 0
        
        return jsonify({
            'total_jobs': sum(status_counts.values()),
            'status_counts': status_counts,
            'success_rate': round(success_rate, 1),
            'recent_activity': recent_activity,
            'matlab_available': matlab_available
        })
        
    except Exception as e:
        return create_error_response(f'Failed to get statistics: {str(e)}', 500)
    
@require_auth
def get_job_details(job_id):
    """Get detailed information about a specific job"""
    try:
        user_id = session.get('user_id')
        job = ModellingJob.query.filter_by(job_id=job_id, user_id=user_id).first()
        
        if not job:
            return create_error_response('Job not found', 404)
        
        job_data = {
            'job_id': job.job_id,
            'pdb_code': job.pdb_code,
            'chain': job.chain,
            'segment_start': job.segment_start,
            'segment_end': job.segment_end,
            'status': job.status,
            'created_at': job.created_at.isoformat(),
            'parameters': json.loads(job.parameters) if job.parameters else {},
            'has_results': bool(job.result_file_path),
            'original_structure': job.pdb_content  # Original PDB content for comparison visualisation
        }
        
        # Add optional timing information
        if job.started_at:
            job_data['started_at'] = job.started_at.isoformat()
        if job.completed_at:
            job_data['completed_at'] = job.completed_at.isoformat()
        if job.processing_time:
            job_data['processing_time'] = job.processing_time
        if job.error_message:
            job_data['error_message'] = job.error_message
        if job.results_data:
            job_data['results'] = json.loads(job.results_data)

        # Handle modelled structure data
        # Try database field first (final model), fallback to file
        if job.final_model_pdb:
            job_data['modelled_structure'] = job.final_model_pdb
            job_data['has_modelled_structure'] = True
            logger.info(f"Final model loaded from database for job {job_id}")
        elif job.result_file_path and Path(job.result_file_path).exists():
            # Fallback to read from file but extract final model
            try:
                with open(job.result_file_path, 'r') as f:
                    full_trajectory = f.read()
                # Extract final model for visualisation
                from matlab_integration import extract_final_model_from_pdb
                final_model = extract_final_model_from_pdb(full_trajectory)
                job_data['modelled_structure'] = final_model
                job_data['has_modelled_structure'] = True
                logger.info(f"Final model extracted from file for job {job_id}: {len(final_model)} chars")
            except Exception as e:
                logger.warning(f"Could not read/extract modelled structure for job {job_id}: {e}")
                job_data['has_modelled_structure'] = False
        else:
            job_data['has_modelled_structure'] = False
            logger.warning(f"No modelled structure found for job {job_id}")
            
        return jsonify(job_data)
        
    except Exception as e:
        logger.error(f"Get job details error: {e}")
        return create_error_response(f'Failed to get job details: {str(e)}', 500)