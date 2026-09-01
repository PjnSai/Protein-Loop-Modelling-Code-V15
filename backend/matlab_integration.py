# matlab_integration.py - MATLAB Engine Integration
import os, time
from pathlib import Path
from typing import Dict, Any
from logging_config import logger

def extract_final_model_from_pdb(pdb_content: str) -> str:
    """Extract final optimised model from MATLAB trajectory output"""
    if not pdb_content or not isinstance(pdb_content, str):
        raise ValueError("Invalid PDB content provided")
    
    lines = pdb_content.strip().split('\n')
    
    # Track models and their content
    models = {}
    current_model = None
    header_lines = []
    footer_lines = []
    in_model = False
    
    # Parse PDB content to separate models
    for line in lines:
        if line.startswith('MODEL'):
            # Extract model number
            try:
                model_parts = line.split()
                if len(model_parts) >= 2:
                    current_model = int(model_parts[1])
                else:
                    current_model = len(models) + 1
                models[current_model] = []
                in_model = True
            except (ValueError, IndexError):
                # Fallback for malformed MODEL lines
                current_model = len(models) + 1
                models[current_model] = []
                in_model = True
                
        elif line.startswith('ENDMDL'):
            in_model = False
            current_model = None
            
        elif line.startswith(('ATOM', 'HETATM', 'TER', 'CONECT')):
            if in_model and current_model is not None:
                # Add to current model
                models[current_model].append(line)
            elif not in_model and len(models) == 0:
                # Single model PDB (no MODEL/ENDMDL blocks)
                if 1 not in models:
                    models[1] = []
                models[1].append(line)
                
        elif line.startswith(('HEADER', 'TITLE', 'REMARK', 'CRYST1', 'ORIGX', 'SCALE')):
            # Keep header information
            header_lines.append(line)
            
        elif line.startswith(('END', 'MASTER')):
            # Keep footer information
            footer_lines.append(line)
    
    # Handle case where no models were found (single structure)
    if not models:
        atom_lines = [line for line in lines if line.startswith(('ATOM', 'HETATM', 'TER', 'CONECT'))]
        # Look for ATOM records without MODEL blocks
        if atom_lines:
            models[1] = atom_lines
    
    if not models:
        raise ValueError("No models or ATOM records found in PDB content")
    
    # Get the final model (highest number = most optimised)
    final_model_number = max(models.keys())
    final_model_atoms = models[final_model_number]
    
    if not final_model_atoms:
        raise ValueError(f"Final model {final_model_number} contains no ATOM records")
    
    # Reconstruct clean single-model PDB
    result_lines = []
    
    # Add headers
    if header_lines:
        result_lines.extend(header_lines)
    else:
        result_lines.append("HEADER    LOOP MODELLING FINAL RESULT")
        result_lines.append("TITLE     FINAL OPTIMISED LOOP STRUCTURE")
        
    # Add final model atoms (no MODEL/ENDMDL blocks for single model)
    result_lines.extend(final_model_atoms)
    
    # Add footer
    if footer_lines:
        result_lines.extend(footer_lines)
    else:
        result_lines.append("END")

    # Join with proper line endings
    final_pdb = '\n'.join(result_lines)
    
    # Validate result has coordinate data
    atom_count = len([line for line in result_lines if line.startswith(('ATOM', 'HETATM'))])
    if atom_count == 0:
        raise ValueError("Final model extraction resulted in no ATOM records")
    
    logger.info(f"Extracted final model {final_model_number} from {len(models)} models")
    
    return final_pdb

def validate_extracted_model(pdb_content: str) -> dict:
    """Validate extracted PDB model for quality and completeness"""
    if not pdb_content or len(pdb_content) < 50:
        return {'is_valid': False, 'error': 'Empty or too short PDB content'}
    
    lines = pdb_content.split('\n')
    atom_count = 0
    model_count = 0
    
    for line in lines:
        if line.startswith('MODEL'):
            model_count += 1
        elif line.startswith('ATOM'):
            atom_count += 1
    
    # Validation criteria
    has_atoms = atom_count > 0
    is_single_model = model_count <= 1
    is_valid = has_atoms and is_single_model
    
    return {
        'is_valid': is_valid,
        'atom_count': atom_count,
        'model_count': model_count,
        'error': None if is_valid else f'Validation failed: atoms={atom_count}, models={model_count}'
    }

class MATLABLoopModeller:
    """MATLAB Engine Interface for Protein Loop Modelling"""
    def __init__(self, matlab_code_dir="matlab_code", results_dir="modelling_results", temp_dir="temp_files"):
        self.matlab_code_dir = Path(matlab_code_dir)
        self.results_dir = Path(results_dir)
        self.temp_dir = Path(temp_dir)
        self.matlab_engine = None

        # Ensure directories exist
        for directory in [self.matlab_code_dir, self.results_dir, self.temp_dir]:
            directory.mkdir(exist_ok=True)
            
    def start_matlab_engine(self):
        """Start MATLAB engine and configure for modelling"""
        try:
            logger.info("Attempting to start MATLAB engine...")

            # Import MATLAB engine
            try:
                import matlab.engine
            except ImportError:
                logger.error("MATLAB Engine for Python not installed")
                return False
            
            # Start the engine
            self.matlab_engine = matlab.engine.start_matlab()
            
            # Add MATLAB code directory to path
            matlab_code_path = str(self.matlab_code_dir.absolute())
            self.matlab_engine.addpath(matlab_code_path)
            logger.info(f"Added MATLAB path: {matlab_code_path}")
            
            # Test engine with simple calculation
            test_result = self.matlab_engine.eval("2+2")
            if test_result != 4:
                logger.error("MATLAB engine test failed")
                return False
            
            logger.info("MATLAB engine started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start MATLAB engine: {e}")
            self.matlab_engine = None
            return False
            
    def stop_matlab_engine(self):
        """Stop MATLAB engine and clean up resources"""
        if self.matlab_engine:
            try:
                self.matlab_engine.quit()
                self.matlab_engine = None
                logger.info("MATLAB engine stopped")
            except Exception as e:
                logger.warning(f"Error stopping MATLAB engine: {e}")

    def validate_parameters(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalise parameters for MATLAB processing"""
        # Check required parameters
        required_params = ['segment_start', 'segment_end', 'chain']
        for param in required_params:
            if param not in params:
                raise ValueError(f"Missing required parameter: {param}")
        
        # Validate segment range
        if params['segment_start'] >= params['segment_end']:
            raise ValueError("segment_start must be less than segment_end")
        
        # Set defaults and normalise
        validated = {
            'chain': params['chain'].upper(),
            'segment_start': int(params['segment_start']),
            'segment_end': int(params['segment_end']),
            'n_iterations': int(params.get('n_iterations', 10000)),
            'target_phi': params.get('target_phi', []),
            'target_psi': params.get('target_psi', []),
            'constrained_phi': params.get('constrained_phi', []),
            'constrained_psi': params.get('constrained_psi', [])
        }
        
        logger.info(f"Parameters validated: {len(validated['target_phi'])} phi, {len(validated['target_psi'])} psi targets")
        
        return validated
        
    def format_matlab_targets(self, target_list):
        """Format target angle parameters for MATLAB"""
        try:
            import matlab
            
            # Handle all empty cases (Python empty list, None, "[]", etc.)
            if (not target_list or 
                len(target_list) == 0 or 
                (isinstance(target_list, str) and target_list.strip() in ['[]', '']) or
                target_list is None):
                return matlab.double([])
            
            # Convert list of dicts to MATLAB double array
            matlab_array = []
            for target in target_list:
                if isinstance(target, dict) and 'residue' in target and 'angle' in target:
                    try:
                        residue = float(target['residue'])
                        angle = float(target['angle'])
                        matlab_array.append([residue, angle])
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Skipping invalid target: {target}, error: {e}")
                        continue
            
            if not matlab_array:
                return matlab.double([])
            
            # Convert to proper MATLAB format: [[residue1, angle1]; [residue2, angle2]]
            return matlab.double(matlab_array)
            
        except Exception as e:
            logger.error(f"Error formatting MATLAB targets: {e}")
            import matlab
            return matlab.double([])

    def format_matlab_constraints(self, constraint_list):
        """Format constraint residue parameters for MATLAB"""
        try:
            import matlab
            
            # Handle all empty cases
            if (not constraint_list or 
                len(constraint_list) == 0 or 
                (isinstance(constraint_list, str) and constraint_list.strip() in ['[]', '']) or
                constraint_list is None):
                return matlab.double([])
            
            # Convert to list of floats
            constraint_array = []
            for item in constraint_list:
                if item is not None:
                    try:
                        constraint_array.append(float(item))
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Skipping invalid constraint: {item}, error: {e}")
                        continue
            
            if not constraint_array:
                return matlab.double([])
            
            # Convert to MATLAB format: [residue1, residue2, ...]
            return matlab.double(constraint_array)
            
        except Exception as e:
            logger.error(f"Error formatting MATLAB constraints: {e}")
            import matlab
            return matlab.double([])
        
    def run_modelling(self, job_id: str, pdb_content: str, modelling_params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute MATLAB loop modelling computation"""
        start_time = time.time()
        
        try:
            # Validate parameters
            params = self.validate_parameters(modelling_params)
            params['pdb_code'] = modelling_params.get('pdb_code', job_id)
            
            logger.info(f"Running Loop_Modeller3 for job {job_id}")
            
            # Check MATLAB engine
            if not self.matlab_engine:
                if not self.start_matlab_engine():
                    return {
                        "success": False,
                        "error_message": "MATLAB system unavailable",
                        "status": "failed",
                        "processing_time": time.time() - start_time,
                        "matlab_available": False
                    }
            
            # Format parameters for MATLAB
            try:
                target_phi = self.format_matlab_targets(params.get('target_phi', []))
                target_psi = self.format_matlab_targets(params.get('target_psi', []))
                constr_phi = self.format_matlab_constraints(params.get('constrained_phi', []))
                constr_psi = self.format_matlab_constraints(params.get('constrained_psi', []))
            except Exception as param_error:
                return {
                    "success": False,
                    "error_message": f"Parameter formatting error: {str(param_error)}",
                    "status": "failed",
                    "processing_time": time.time() - start_time
                }
            
            # Set up MATLAB working directory
            original_matlab_dir = self.matlab_engine.pwd()
            results_dir_abs = str(self.results_dir.absolute())
            
            try:
                # Change MATLAB working directory to results folder
                self.matlab_engine.cd(results_dir_abs)
                logger.info(f"MATLAB working directory set to: {results_dir_abs}")
                
                # Call Loop_Modeller3 MATLAB function
                success, error_msg, results = self.matlab_engine.feval(
                    "Loop_Modeller3",
                    pdb_content,
                    params['pdb_code'],
                    params['chain'],
                    float(params['segment_start']),
                    float(params['segment_end']),
                    target_phi,
                    target_psi,
                    constr_phi,
                    constr_psi,
                    float(params['n_iterations']),
                    nargout=3,
                    background=False
                )
                
            except Exception as matlab_error:
                return {
                    "success": False,
                    "error_message": f"MATLAB execution error: {str(matlab_error)}",
                    "status": "failed",
                    "processing_time": time.time() - start_time
                }
            finally:
                # Always restore original MATLAB working directory
                try:
                    self.matlab_engine.cd(original_matlab_dir)
                except:
                    pass
            
            # Process results with correct file paths
            if success:
                try:
                    results_dict = {
                        'n_iterations_used': int(results['n_iterations_used']),
                        'final_distance': float(results['final_distance']),
                        'optimization_time': float(results['optimization_time']),
                        'n_models': int(results['n_models']),
                        'degrees_of_freedom': int(results['degrees_of_freedom']),
                        'output_file': str(results['output_file']),
                        'segment_length': int(results.get('segment_length', params['segment_end'] - params['segment_start'] + 1))
                    }
                    
                    # Check for output file in results directory
                    output_file = results_dict['output_file']
                    if os.path.isabs(output_file):
                        output_path = Path(output_file)
                    else:
                        output_path = self.results_dir / output_file
                    
                    if output_path.exists():
                        results_dict['output_file_path'] = str(output_path)
                        results_dict['file_size'] = output_path.stat().st_size
                        
                        # Read and process modelled structure
                        try:
                            with open(output_path, 'r') as f:
                                full_trajectory_pdb = f.read()
                            
                            # Extract final model for clean visualisation
                            try:
                                final_model_pdb = extract_final_model_from_pdb(full_trajectory_pdb)
                                results_dict['modelled_pdb_content'] = final_model_pdb
                                results_dict['trajectory_pdb_content'] = full_trajectory_pdb
                                results_dict['has_structure'] = True
                                
                                # Validate extraction
                                validation = validate_extracted_model(final_model_pdb)
                                results_dict['model_extraction_valid'] = validation['is_valid']
                                results_dict['final_model_atoms'] = validation['atom_count']
                                
                                logger.info(f"Final model extracted: {results_dict['n_models']} models, {validation['atom_count']} atoms")
                                
                            except Exception as extract_error:
                                logger.warning(f"Final model extraction failed: {extract_error}")
                                # Fallback to full trajectory
                                results_dict['modelled_pdb_content'] = full_trajectory_pdb
                                results_dict['trajectory_pdb_content'] = full_trajectory_pdb
                                results_dict['has_structure'] = True
                                results_dict['model_extraction_valid'] = False
                                results_dict['extraction_error'] = str(extract_error)
                                
                        except Exception as read_error:
                            logger.warning(f"Could not read modelled PDB: {read_error}")
                            results_dict['has_structure'] = False
                        
                        return {
                            "success": True,
                            "status": "completed",
                            "processing_time": time.time() - start_time,
                            "results": results_dict,
                            "job_id": job_id,
                            "matlab_available": True
                        }
                    else:
                        # Debug file location issue
                        logger.error(f"Output file not found: {output_path}")
                        return {
                            "success": False,
                            "error_message": f"Output file not found: {output_path}",
                            "status": "failed"
                        }
                except Exception as parse_error:
                    return {
                        "success": False,
                        "error_message": f"Failed to parse results: {str(parse_error)}",
                        "status": "failed"
                    }
            else:
                return {
                    "success": False,
                    "error_message": f"MATLAB failed: {error_msg}",
                    "status": "failed",
                    "processing_time": time.time() - start_time
                }
                    
        except Exception as e:
            logger.error(f"Error in MATLAB modelling: {e}")
            return {
                "success": False,
                "error_message": f"MATLAB execution error: {str(e)}",
                "status": "failed",
                "processing_time": time.time() - start_time
            }

def create_matlab_modeller(matlab_code_dir="matlab_code", results_dir="modelling_results", temp_dir="temp_files") -> MATLABLoopModeller:
    """Function for creating MATLAB modeller instance"""
    try:
        # Try to import MATLAB engine to check availability
        import matlab.engine
        logger.info("MATLAB Engine for Python is available")
        return MATLABLoopModeller(matlab_code_dir=matlab_code_dir, results_dir=results_dir, temp_dir=temp_dir)
    except ImportError:
        logger.error("MATLAB Engine for Python not installed")
        raise ImportError("MATLAB Engine for Python is required but not installed")