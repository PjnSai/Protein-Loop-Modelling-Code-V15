# context.py - Application Context and Shared Resources
import os
from demo_utils import DemoJobManager
from matlab_integration import create_matlab_modeller
import requests
from pathlib import Path
from logging_config import logger

class PDBManager:
    def __init__(self, cache_dir):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.pdb_base_url = "https://files.rcsb.org/download/"
    
    def fetch_pdb(self, pdb_code):
        """Fetch PDB file from RCSB database with local caching"""
        pdb_code = pdb_code.upper()
        cache_file = self.cache_dir / f"{pdb_code}.pdb"
        
        # Check cache first
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                return f.read()
        
        # Download from RCSB
        url = f"{self.pdb_base_url}{pdb_code}.pdb"
        try:
            response = requests.get(url, timeout=30)
            
            if response.status_code == 200:
                pdb_content = response.text
                # Cache the file
                with open(cache_file, 'w') as f:
                    f.write(pdb_content)
                return pdb_content
            else:
                raise Exception(f"Failed to fetch PDB {pdb_code}: HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error fetching PDB {pdb_code}: {str(e)}")
    
    def analyse_pdb(self, pdb_content):
        """Analyse PDB structure and extract basic information"""
        lines = pdb_content.split('\n')
        
        info = {
            'chains': set(),
            'residues': {},
            'resolution': None,
            'method': None,
            'title': '',
            'total_atoms': 0,
            'total_residues': 0
        }
        
        for line in lines:
            if line.startswith('ATOM'):
                info['total_atoms'] += 1
                if len(line) >= 22:
                    chain = line[21].strip()
                    try:
                        res_num = int(line[22:26].strip())
                        res_name = line[17:20].strip()
                        
                        if chain:
                            info['chains'].add(chain)
                            if chain not in info['residues']:
                                info['residues'][chain] = {}
                            if res_num not in info['residues'][chain]:
                                info['residues'][chain][res_num] = res_name
                    except ValueError:
                        continue  # Skip malformed lines
            
            elif line.startswith('REMARK   2 RESOLUTION'):
                try:
                    parts = line.split()
                    if len(parts) >= 4:
                        info['resolution'] = float(parts[-2])
                except (ValueError, IndexError):
                    pass
            
            elif line.startswith('EXPDTA'):
                info['method'] = line[10:].strip()
            
            elif line.startswith('TITLE'):
                info['title'] += line[10:].strip() + ' '
        
        # Convert sets to sorted lists for JSON serialisation
        info['chains'] = sorted(list(info['chains']))
        info['title'] = info['title'].strip()
        
        # Calculate residue ranges per chain
        for chain in info['residues']:
            residues = list(info['residues'][chain].keys())
            if residues:
                info['residues'][chain] = {
                    'range': [min(residues), max(residues)],
                    'count': len(residues),
                    'residues': {str(k): v for k, v in info['residues'][chain].items()}
                }
        
        info['total_residues'] = sum(data['count'] for data in info['residues'].values())
        
        return info

# Directory structure configuration
PDB_CACHE_DIR = 'pdb_cache'
RESULTS_DIR = 'modelling_results'
MATLAB_CODE_DIR = 'matlab_code'
UPLOAD_FOLDER = 'uploads'
DEMO_JOBS_DIR = 'demo_jobs'
TEMP_FILES_DIR = 'temp_files'

# Create required directories
for directory in [PDB_CACHE_DIR, RESULTS_DIR, MATLAB_CODE_DIR, UPLOAD_FOLDER]:
    os.makedirs(directory, exist_ok=True)
    

# Create shared instances used throughout the application
pdb_manager = PDBManager(PDB_CACHE_DIR)
demo_job_manager = DemoJobManager()

# MATLAB integration setup
try:
    matlab_modeller = create_matlab_modeller(matlab_code_dir=MATLAB_CODE_DIR, results_dir=RESULTS_DIR)
    matlab_available = True
except ImportError as e:
    logger.warning(f"MATLAB not available: {e}")
    matlab_modeller = None
    matlab_available = False