# modelling_routes.py - Protein Loop Modelling Routes
from flask import request, jsonify, session, send_file
import json, uuid
from datetime import datetime
from pathlib import Path
from utils import log_event, require_auth
from models import User, ModellingJob
from extensions import db
from logging_config import logger
from modelling_utils import clean_parameters, fetch_pdb_with_analysis, check_matlab_system, create_error_response, run_matlab_modelling

def format_job_data(job, include_structure=False):
    """Format job data for API responses"""
    data = {
        'job_id': job.job_id,
        'status': job.status,
        'created_at': job.created_at.isoformat(),
        'pdb_code': job.pdb_code,
        'chain': job.chain,
        'segment_start': job.segment_start,
        'segment_end': job.segment_end,
        'parameters': json.loads(job.parameters) if job.parameters else {}
    }
    
    # Add optional timestamp and fields if they exist
    if job.started_at:
        data['started_at'] = job.started_at.isoformat()
    if job.completed_at:
        data['completed_at'] = job.completed_at.isoformat()
    if job.processing_time:
        data['processing_time'] = job.processing_time
    if job.error_message:
        data['error_message'] = job.error_message
    if job.results_data:
        data['results'] = json.loads(job.results_data)
    
    # Add structure data if requested (for visualisation)
    if include_structure:
        data['original_structure'] = job.pdb_content
        data['has_modelled_structure'] = False
        
        if job.result_file_path and Path(job.result_file_path).exists():
            try:
                with open(job.result_file_path, 'r') as f:
                    data['modelled_structure'] = f.read()
                data['has_modelled_structure'] = True
            except Exception as e:
                logger.warning(f"Could not read structure for job {job.job_id}: {e}")
    
    return data

def get_user_job(job_id, user_id):
    """Get job for user with authorisation validation"""
    job = ModellingJob.query.filter_by(job_id=job_id, user_id=user_id).first()
    if not job:
        return None, create_error_response('Job not found', 404)
    return job, None

@require_auth
def fetch_pdb_structure(pdb_code):
    """Fetch PDB structure from RCSB database with analysis"""
    try:
        user = User.query.get(session.get('user_id'))
        
        # Fetch PDB with structural analysis
        pdb_content, analysis, error = fetch_pdb_with_analysis(pdb_code)
        if error:
            log_event(user.email, 'pdb-fetch', 'failed', request.remote_addr)
            return create_error_response(f'Failed to fetch PDB: {error}')
        
        log_event(user.email, 'pdb-fetch', 'success', request.remote_addr)
        
        return jsonify({
            'success': True,
            'pdb_code': pdb_code.upper(),
            'pdb_content': pdb_content,
            'analysis': analysis
        })
        
    except Exception as e:
        logger.error(f"PDB fetch error: {e}")
        return create_error_response('Failed to fetch PDB structure', 500)

@require_auth
def submit_modelling_job():
    """Submit protein loop modelling job for MATLAB processing for authenticated users"""
    try:
        user = User.query.get(session.get('user_id'))
        if not user:
            return create_error_response('User not found', 404)
        
        data = request.get_json()
        
        # Check MATLAB system availability
        matlab_error = check_matlab_system()
        if matlab_error:
            return create_error_response(matlab_error, 503)
        
        # Get PDB structure content
        pdb_content, _, fetch_error = fetch_pdb_with_analysis(data['pdb_code'])
        if fetch_error:
            return create_error_response(f'Failed to fetch PDB: {fetch_error}')
        
        # Clean and validate parameters
        params = clean_parameters(data, demo_mode=False)
        job_id = str(uuid.uuid4())
        
        # Create database job record
        job = ModellingJob(
            job_id=job_id,
            user_id=user.id,
            pdb_code=params['pdb_code'],
            chain=params['chain'],
            segment_start=params['segment_start'],
            segment_end=params['segment_end'],
            parameters=json.dumps(params),
            status='running',
            pdb_content=pdb_content,
            started_at=datetime.utcnow()
        )
        
        db.session.add(job)
        db.session.commit()
        
        logger.info(f"Processing job {job_id} with MATLAB")
        
        # Execute MATLAB modelling
        result = run_matlab_modelling(job_id, pdb_content, params)
        
        # Update job with results
        job.completed_at = datetime.utcnow()
        job.processing_time = result.get('processing_time', 0)
        
        if result['success']:
            job.status = 'completed'
            job.results_data = json.dumps(result.get('results', {}))
            if 'results' in result and 'output_file_path' in result['results']:
                job.result_file_path = result['results']['output_file_path']
            
            if 'modelled_structure' in result:
                job.final_model_pdb = result['modelled_structure']
            
            log_event(user.email, 'modelling-submit', 'success', request.remote_addr)
            logger.info(f"Job {job_id} completed successfully")
            
            db.session.commit()
            return jsonify({
                'success': True,
                'job_id': job_id,
                'message': 'Modelling completed successfully',
                'results': result.get('results', {}),
                'processing_time': result.get('processing_time', 0),
                'parameters': params,
                'pdb_code': params['pdb_code']
            })
        else:
            job.status = 'failed'
            job.error_message = result.get('error_message', 'Unknown error')
            
            log_event(user.email, 'modelling-submit', 'failed', request.remote_addr)
            logger.error(f"Job {job_id} failed: {job.error_message}")
            
            db.session.commit()
            return create_error_response(result.get('error_message', 'Modelling failed'), 500)
        
    except Exception as e:
        logger.error(f"Submit modelling job error: {e}")
        db.session.rollback()
        return create_error_response('Failed to submit job', 500)

@require_auth
def download_job_results(job_id):
    """Download modelling results as PDB file"""
    try:
        job, error = get_user_job(job_id, session.get('user_id'))
        if error:
            return error
        
        if job.status != 'completed':
            return create_error_response('No results available for download')
        
        # Use final model from database instead of full trajectory file for clean visualisation
        if job.final_model_pdb:
             # Create temporary file with final model only
            import tempfile
            with tempfile.NamedTemporaryFile(mode='w', suffix='.pdb', delete=False) as temp_file:
                temp_file.write(job.final_model_pdb)
                temp_file_path = temp_file.name
            
            filename = f"{job.pdb_code}_{job.chain}_{job.segment_start}-{job.segment_end}_final_model.pdb"
            return send_file(temp_file_path, as_attachment=True, download_name=filename, mimetype='chemical/x-pdb')
        else:
            return create_error_response('Final model not available for download', 404)
        
    except Exception as e:
        logger.error(f"Download error: {e}")
        return create_error_response('Download failed', 500)

@require_auth
def cancel_job(job_id):
    """Cancel a running or queued modelling job for authenticated users"""
    try:
        job, error = get_user_job(job_id, session.get('user_id'))
        if error:
            return error
        
        if job.status not in ['queued', 'running']:
            return create_error_response('Job cannot be cancelled in current status')
        
        job.status = 'cancelled'
        job.completed_at = datetime.utcnow()
        db.session.commit()
        
        logger.info(f"Job {job_id} cancelled successfully")
        return jsonify({'message': 'Job cancelled successfully'})
        
    except Exception as e:
        logger.error(f"Cancel job error: {e}")
        return create_error_response('Failed to cancel job', 500)
    
@require_auth
def delete_job(job_id):
    """Delete a completed, failed, or cancelled job for authenticated users"""
    try:
        job, error = get_user_job(job_id, session.get('user_id'))
        if error:
            return error
        
        if job.status not in ['completed', 'failed', 'cancelled']:
            return create_error_response('Only completed, failed, or cancelled jobs can be deleted')
        
        # Delete result files from disk (Optional)
        if job.result_file_path and Path(job.result_file_path).exists():
            try:
                Path(job.result_file_path).unlink()  # Delete file
                logger.info(f"Deleted result file for job {job_id}")
            except Exception as e:
                logger.warning(f"Could not delete result file for job {job_id}: {e}")
        
        # Delete job from database
        db.session.delete(job)
        db.session.commit()
        
        logger.info(f"Job {job_id} deleted successfully")
        return jsonify({'message': 'Job deleted successfully'})
        
    except Exception as e:
        logger.error(f"Delete job error: {e}")
        db.session.rollback()
        return create_error_response('Failed to delete job', 500)

@require_auth
def modelling_system_status():
    """Get status of MATLAB modelling system"""
    try:
        user = User.query.get(session.get('user_id'))
        
        matlab_error = check_matlab_system()
        system_ready = matlab_error is None
        
        status_data = {
            'matlab_available': system_ready,
            'system_ready': system_ready,
            'user_id': user.id,
            'user_email': user.email,
            'deployment_mode': 'immediate_processing'
        }
        
        if system_ready:
            status_data['message'] = 'System ready for loop modelling'
        else:
            status_data['message'] = matlab_error
            status_data['matlab_error'] = matlab_error
        
        return jsonify(status_data)
        
    except Exception as e:
        logger.error(f"System status error: {e}")
        return create_error_response('Failed to get system status', 500)
    
@require_auth
def get_job_with_results(job_id):
    """Get job details with modelled structure for visualisation"""
    try:
        job, error = get_user_job(job_id, session.get('user_id'))
        if error:
            return error
        
        return jsonify(format_job_data(job, include_structure=True))
        
    except Exception as e:
        logger.error(f"Get job with results error: {e}")
        return create_error_response('Failed to get job details', 500)