# MATLAB Modelling Code Notice

The proprietary MATLAB source scripts (including `Loop_Modeller3.m`) used for loop closure and optimization are restricted academic property and are not included in this public repository.

### Requirements for Running Locally

To execute the modelling pipeline:

1. Place the authorized MATLAB scripts into this `backend/matlab_code/` directory.
2. Ensure the MATLAB Engine API for Python is installed in your Python virtual environment.
3. Configure the directory path in `backend/.env` if using a custom location.

_Note: The web application, authentication system, structure visualization, and RCSB PDB fetching tools remain fully functional without this proprietary module._
