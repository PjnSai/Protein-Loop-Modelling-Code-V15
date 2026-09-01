# modelling_utils.py - Shared Utility Functions for Protein Modelling
from flask import jsonify
from context import pdb_manager, matlab_available, matlab_modeller
from logging_config import logger

def validate_pdb_code(pdb_code):
    """ Validate PDB (Protein Data Bank) code format"""
    if not pdb_code or len(pdb_code) != 4 or not pdb_code.isalnum():
        return "Invalid PDB code format. Please enter a 4-character code."
    return None

def validate_basic_params(data):
    """Validate basic modelling parameters"""
    if not data:
        return "No data provided"
    
    # Check all required fields are present
    required_fields = ['pdb_code', 'chain', 'segment_start', 'segment_end']
    missing = [f for f in required_fields if f not in data]
    if missing:
        return f'Missing required parameters: {", ".join(missing)}'
    
    # Validate segment range makes sense
    if data['segment_start'] >= data['segment_end']:
        return 'segment_start must be less than segment_end'
    
    return None

def clean_angle_parameters(params):
    """Clean and validate angle parameters for MATLAB processing"""
    
    def clean_angle_value(value):
        """Clean individual angle value with range and precision limits"""
        if value is None:
            return 0
        
        # Convert to float and handle invalid inputs
        try:
            angle = float(value)
        except (ValueError, TypeError):
            return 0
        
        # Round to 4 decimal places maximum
        angle = round(angle, 4)
        
        # Clamp to valid phi/psi angle range
        if angle < -180:
            angle = -180
        elif angle > 180:
            angle = 180
            
        return angle
    
    def clean_target_list(target_list):
        """Clean list of target angles (phi or psi)"""
        if not target_list:
            return []
        
        cleaned = []
        for target in target_list:
            if isinstance(target, dict) and 'residue' in target and 'angle' in target:
                cleaned_target = {
                    'residue': int(target['residue']),
                    'angle': clean_angle_value(target['angle'])
                }
                cleaned.append(cleaned_target)
        return cleaned
    
    # Clean the parameters
    cleaned_params = params.copy()
    
    # Clean target phi angles (backbone flexibility)
    if 'target_phi' in cleaned_params:
        cleaned_params['target_phi'] = clean_target_list(cleaned_params['target_phi'])
    
    # Clean target psi angles (backbone flexibility)
    if 'target_psi' in cleaned_params:
        cleaned_params['target_psi'] = clean_target_list(cleaned_params['target_psi'])
    
    return cleaned_params

def clean_parameters(data, demo_mode=False):
    """Clean and standardise parameters for both demo and auth"""
    params = {
        'pdb_code': str(data['pdb_code']).upper(),  # Standardise to uppercase
        'chain': str(data['chain']).upper(),        # Standardise to uppercase
        'segment_start': int(data['segment_start']),
        'segment_end': int(data['segment_end']),
        
        # Iteration count: fewer for demo to reduce processing time
        'n_iterations': int(data.get('n_iterations', 5000 if demo_mode else 10000)),
        
        # Angle targets and constraints (empty lists if not provided)
        'target_phi': data.get('target_phi', []),
        'target_psi': data.get('target_psi', []),
        'constrained_phi': data.get('constrained_phi', []),
        'constrained_psi': data.get('constrained_psi', [])
    }
    
    # Apply angle parameter cleaning and validation
    params = clean_angle_parameters(params)
    
    return params

def fetch_pdb_with_analysis(pdb_code):
    """Fetch protein structure from RCSB database with analysis - shared by demo and auth"""
    try:
        # Fetch PDB content using cached manager
        pdb_content = pdb_manager.fetch_pdb(pdb_code)
        
        # Perform structural analysis for frontend display
        analysis = pdb_manager.analyse_pdb(pdb_content)
        
        return pdb_content, analysis, None
    except Exception as e:
        return None, None, str(e)

def check_matlab_system():
    """Check MATLAB system availability for modelling for both demo and auth"""
    if not matlab_available or not matlab_modeller:
        return "MATLAB system not available"
    return None

def create_error_response(message, status_code=400, demo_mode=False):
    """Create unified error response for API consistency for demo and auth"""
    if demo_mode:
        return jsonify({
            'success': False,
            'error': message,
            'demo_mode': True
        }), status_code
    else:
        return jsonify({'error': message}), status_code

def run_matlab_modelling(job_id, pdb_content, params):
    """Execute MATLAB modelling computation with error handling for both demo and auth"""
    try:
        # Execute MATLAB modelling using the integrated modeller
        result = matlab_modeller.run_modelling(
            job_id=job_id,
            pdb_content=pdb_content,
            modelling_params=params
        )
        
        if result['success']:
            # Process successful results
            modelled_structure = result['results'].get('modelled_pdb_content', '')
            
            if modelled_structure:
                try:
                    # Extract final optimised model from MATLAB trajectory
                    from matlab_integration import extract_final_model_from_pdb
                    modelled_structure = extract_final_model_from_pdb(modelled_structure)
                    logger.info(f"Final model extracted for job {job_id}")
                except Exception as e:
                    logger.warning(f"Using full trajectory for job {job_id}: {e}")
            
            return {
                'success': True,
                'results': result['results'],
                'modelled_structure': modelled_structure,
                'processing_time': result.get('processing_time', 0)
            }
        else:
            return {
                'success': False,
                'error_message': result.get('error_message', 'MATLAB processing failed')
            }
    except Exception as e:
        logger.error(f"MATLAB execution error for job {job_id}: {e}")
        return {
            'success': False,
            'error_message': f'MATLAB execution error: {str(e)}'
        }