# demo_routes.py - Demo Mode API Endpoints
from flask import request, jsonify, send_file
from datetime import datetime
import tempfile
from logging_config import logger
from context import demo_job_manager
from modelling_utils import validate_pdb_code, validate_basic_params, clean_parameters, fetch_pdb_with_analysis, check_matlab_system, create_error_response, run_matlab_modelling

def demo_search_pdb():
    """Demo PDB search - validates 4-digit PDB codes only"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return create_error_response('Search query required', demo_mode=True)
        
        # Only support 4-character PDB codes in demo mode
        validation_error = validate_pdb_code(query)
        if validation_error:
            return create_error_response(
                'Please enter a 4-character PDB code',
                suggestions=[
                    'Example PDB codes: 1ADG, 1UBQ, 2LYZ, 1CRN',
                    'Visit rcsb.org to find PDB codes for specific proteins'
                ],
                demo_mode=True
            )
        
        # Fetch and analyse PDB structure
        pdb_content, analysis, error = fetch_pdb_with_analysis(query)
        if error:
            return create_error_response(f'PDB structure {query.upper()} not found: {error}', demo_mode=True)
        
        return jsonify({
            'success': True,
            'results': [{
                'pdb_code': query.upper(),
                'title': analysis.get('title', 'Structure found'),
                'method': analysis.get('method', 'Unknown'),
                'resolution': analysis.get('resolution'),
                'chains': analysis.get('chains', ['A']),
                'total_residues': analysis.get('total_residues', 0)
            }],
            'total_found': 1,
            'demo_mode': True
        })
        
    except Exception as e:
        logger.error(f"Demo search error: {e}")
        return create_error_response('Search system temporarily unavailable', demo_mode=True)

def demo_fetch_pdb(pdb_code):
    """Demo PDB fetch - downloads and analyses protein structure"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Validate PDB code format
        validation_error = validate_pdb_code(pdb_code)
        if validation_error:
            return create_error_response(validation_error, demo_mode=True)
        
        # Fetch PDB with structural analysis
        pdb_content, analysis, error = fetch_pdb_with_analysis(pdb_code)
        if error:
            return create_error_response(f'PDB structure {pdb_code.upper()} not found: {error}', demo_mode=True)
        
        return jsonify({
            'success': True,
            'pdb_code': pdb_code.upper(),
            'pdb_content': pdb_content,
            'analysis': analysis,
            'demo_mode': True,
            'message': 'Demo mode - register for full modelling capabilities'
        })
        
    except Exception as e:
        logger.error(f"Demo fetch error for {pdb_code}: {e}")
        return create_error_response('Failed to fetch PDB structure', demo_mode=True)

def demo_prepare_modelling():
    """Demo modelling preparation - validates parameters and calculates constraints"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        
        # Validate modelling parameters
        param_error = validate_basic_params(data)
        if param_error:
            return create_error_response(param_error, demo_mode=True)
        
        # Calculate preparation data
        segment_length = data['segment_end'] - data['segment_start'] + 1
        degrees_of_freedom = max(0, (segment_length * 2) - 6)
        
        preparation = {
            'pdb_code': data['pdb_code'],
            'chain': data['chain'],
            'segment_start': data['segment_start'],
            'segment_end': data['segment_end'],
            'segment_length': segment_length,
            'degrees_of_freedom': degrees_of_freedom,
            'suggested_parameters': {
                'n_iterations': min(10000, max(1000, segment_length * 500)),
                'target_phi': [],
                'target_psi': [],
                'constrained_phi': [],
                'constrained_psi': []
            },
            'demo_mode': True
        }
        
        return jsonify({
            'success': True,
            'preparation': preparation
        })
        
    except Exception as e:
        logger.error(f"Demo preparation error: {e}")
        return create_error_response('Preparation failed', demo_mode=True)

def demo_submit_modelling():
    """Demo modelling submission - runs MATLAB with temporary storage"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        
        logger.info(f"Demo modelling request: {data.get('pdb_code')}")
        
        # Validate parameters
        param_error = validate_basic_params(data)
        if param_error:
            return create_error_response(param_error, demo_mode=True)
        
        # Check MATLAB availability
        matlab_error = check_matlab_system()
        if matlab_error:
            return create_error_response(matlab_error, 503, demo_mode=True)
        
        # Clean and validate parameters
        try:
            cleaned_params = clean_parameters(data, demo_mode=True)
        except (ValueError, TypeError) as e:
            return create_error_response(f'Parameter validation failed: {str(e)}', demo_mode=True)
        
        # Get PDB structure content
        pdb_content, _, fetch_error = fetch_pdb_with_analysis(cleaned_params['pdb_code'])
        if fetch_error:
            return create_error_response(f'Failed to fetch PDB {cleaned_params["pdb_code"]}: {fetch_error}', demo_mode=True)
        
        # Create demo job with temporary storage
        demo_job = demo_job_manager.create_demo_job(
            pdb_code=cleaned_params['pdb_code'],
            parameters=cleaned_params
        )
        
        logger.info(f"Running MATLAB modelling for demo job {demo_job['job_id']}")
        
        # Execute MATLAB modelling (same as authenticated mode)
        result = run_matlab_modelling(demo_job['job_id'], pdb_content, cleaned_params)
        
        if result['success']:
            # Update demo job with successful results
            demo_job_manager.update_demo_job(demo_job['job_id'], {
                'status': 'completed',
                'completed_at': datetime.utcnow().isoformat(),
                'results': result['results'],
                'has_results': True,
                'modelled_structure': result['modelled_structure'],
                'matlab_processing': True
            })
            
            return jsonify({
                'success': True,
                'job_id': demo_job['job_id'],
                'status': 'completed',
                'message': 'Demo modelling completed using real MATLAB',
                'demo_mode': True,
                'parameters': cleaned_params,
                'pdb_code': demo_job['pdb_code'],
                'results': result['results'],
                'processing_time': result.get('processing_time', 0)
            })
        else:
            # Update demo job with failure information
            demo_job_manager.update_demo_job(demo_job['job_id'], {
                'status': 'failed',
                'completed_at': datetime.utcnow().isoformat(),
                'error_message': result.get('error_message', 'MATLAB processing failed'),
                'has_results': False
            })
            
            return create_error_response(
                f"MATLAB modelling failed: {result.get('error_message', 'Unknown error')}",
                500,
                demo_mode=True
            )
        
    except Exception as e:
        logger.error(f"Demo submission error: {e}")
        return create_error_response('Demo submission failed', demo_mode=True)

def demo_job_download(job_id):
    """Download demo job results - temporary file access within 24-hour window"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        demo_job = demo_job_manager.get_demo_job(job_id)
        
        if not demo_job or not demo_job.get('has_results'):
            return create_error_response('Demo job not found or no results available', 404, demo_mode=True)
        
        # Get modelled structure content from MATLAB results
        modelled_content = demo_job.get('modelled_structure') or demo_job['results'].get('modelled_pdb_content')

        if not modelled_content:
            return create_error_response(
                'MATLAB results not available for download. Please try submitting the job again.',
                404, 
                demo_mode=True
            )
        
        # Create temporary file for download
        with tempfile.NamedTemporaryFile(mode='w', suffix='.pdb', delete=False) as temp_file:
            temp_file.write(modelled_content)
            temp_file_path = temp_file.name
        
        # Generate descriptive filename
        filename = f"demo_{demo_job['pdb_code']}_{demo_job['parameters']['chain']}_modelled.pdb"
        
        return send_file(
            temp_file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='chemical/x-pdb'
        )
        
    except Exception as e:
        logger.error(f"Demo download error: {e}")
        return create_error_response('Demo download failed', demo_mode=True)