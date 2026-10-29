# Protein Loop Modelling Web Server

A web application that lets researchers run protein loop modelling from a browser instead of MATLAB. The user enters a PDB code, inspects the structure in 3D, chooses a loop segment and target backbone angles, and receives a modelled structure that can be compared with the original and downloaded.

![Protein view with chain and segment selection](docs/images/segment-select.png)

The modelling algorithm is a set of MATLAB scripts written by Dr Steven Hayward. This project wraps them in a Flask API and a React interface. Third-year project, University of East Anglia, BSc Computer Science.

## Screenshots

### Homepage and job history

<table>
  <tr>
    <td align="center">
      <img src="docs/images/homepage.png" alt="Homepage for demo user" width="100%">
      <br>Homepage for demo user
    </td>
    <td align="center">
      <img src="docs/images/downloadable-job.png" alt="Downloadable job from job history" width="100%">
      <br>Downloadable job from job history
    </td>
  </tr>
</table>

## Features

- PDB lookup by 4-character code, with chain, residue range and resolution shown
- Two interactive 3D viewers (3Dmol.js and NGL Viewer) with cartoon, line, stick and sphere styles, and the selected loop segment highlighted
- Parameter form for target phi/psi angles, constrained residues and iteration count, with conflict checks (the same angle cannot be both targeted and constrained)
- Side-by-side comparison of the original and modelled structures, and download of the modelled PDB file
- Two modes:
  - **Demo mode:** no account needed. Results are held in memory and expire after 24 hours. Iterations are capped at 5,000.
  - **Registered mode:** results are stored in PostgreSQL with a dashboard of past jobs. Iterations are capped at 50,000 in the interface.
- Authentication: email OTP two-factor login, bcrypt password hashing, password strength scoring (zxcvbn), breached-password checks (Have I Been Pwned), account lockout after 5 failed attempts, password reset by email, and 30-minute sessions
- Activity log page, profile page and job dashboard with statistics

### Modelling workflow

<table>
  <tr>
    <td align="center">
      <img src="docs/images/enter-pdb.png" alt="PDB code selection and visualisation" width="100%">
      <br>PDB code selection and visualisation
    </td>
    <td align="center">
      <img src="docs/images/parameter-form.png" alt="Parameter form with phi/psi targets" width="100%">
      <br>Parameter form with phi/psi targets
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/images/parameter-selection.png" alt="Selected phi/psi targets, angles, constraints and iterations" width="100%">
      <br>Selected targets, angles, constraints and iterations
    </td>
    <td align="center">
      <img src="docs/images/viewer-comparison.png" alt="Original and modelled structures side by side" width="100%">
      <br>Original and modelled structures side by side
    </td>
  </tr>
</table>

## Architecture

```
React (Vite, Bootstrap)  <->  Flask REST API  <->  MATLAB Engine API  <->  MATLAB scripts
  3Dmol.js / NGL                  |
                              PostgreSQL (users, login logs, jobs)
```

1. The frontend fetches the structure from the Flask API, which downloads and caches it from RCSB.
2. The user selects a segment and parameters. The backend validates and cleans them.
3. Flask calls `Loop_Modeller3.m` through the MATLAB Engine. The result is a multi-model PDB trajectory.
4. The backend extracts the final model, stores it (registered mode) or holds it in memory (demo mode), and returns it for display.

## Project structure

```
backend/
  app.py                 Flask application and route registration
  auth_routes.py         Registration, login, OTP, logout
  password_routes.py     Password reset and change
  profile_routes.py      Profile and activity logs
  dashboard_routes.py    Job list, statistics and job details
  modelling_routes.py    Authenticated modelling endpoints
  demo_routes.py         Demo mode endpoints
  modelling_utils.py     Parameter cleaning and shared helpers
  matlab_integration.py  MATLAB Engine wrapper and result parsing
  context.py             PDB download/cache and shared instances
  models.py              SQLAlchemy models (User, LoginLog, ModellingJob)
  utils.py               Auth decorator, email, password checks
  matlab_code/           MATLAB scripts (26 files)
frontend/
  src/
    pages/               Route-level pages
    components/          Forms, viewers, dashboard, modelling steps
    hooks/ api/ services/ context/ utils/
```

## MATLAB code

`matlab_code/` contains 24 files. The algorithm is by Dr Steven Hayward. Two scripts were adapted for web use:

| Original (kept for reference) | Web version (used by the server) |
| ----------------------------- | -------------------------------- |
| `Loop_Modeller2.m`            | `Loop_Modeller3.m`               |
| `Segment_prep.m`              | `Segment_prep2.m`                |

The changes were limited to turning a script into a function, accepting PDB content and parameters as inputs instead of hard-coded values, and returning a result structure. The scientific calculation is unchanged.

## Requirements

- Python 3.10 or later
- Node.js 18 or later
- PostgreSQL
- MATLAB with the Bioinformatics Toolbox (`pdbread` and `pdbwrite` are used) and the MATLAB Engine API for Python
- A Gmail account with an app password, used to send OTP and reset emails

Without MATLAB the server still starts, and login, the dashboard, PDB lookup and 3D viewing work. Submitting a modelling job returns "MATLAB system not available".

## Setup

### 1. Database

```sql
CREATE DATABASE protein_model;
CREATE USER protein_user WITH PASSWORD 'choose-a-password';
GRANT ALL PRIVILEGES ON DATABASE protein_model TO protein_user;
```

Tables are created automatically on first start.

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Install the MATLAB Engine for Python from your MATLAB installation (see MathWorks documentation for `matlab.engine`).

Create `backend/.env`:

```
SECRET_KEY=replace-with-a-long-random-string
DATABASE_URL=postgresql://protein_user:your-password@localhost:5432/protein_model
MAIL_SENDER=your.address@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

Never commit `.env`. Make sure it is listed in `.gitignore`.

Start the server:

```bash
python app.py
```

The API runs on `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The interface runs on `http://localhost:5173`. The API address is currently set in the frontend source as `http://localhost:8000`.

## Example run

A known working test case is alcohol dehydrogenase (PDB `1ADG`), chain A, segment 290 to 301:

| Parameter       | Value                                   |
| --------------- | --------------------------------------- |
| Target phi      | 291: -90, 292: -110, 293: -64, 294: -90 |
| Target psi      | 291: 122, 292: -35, 293: 147            |
| Constrained phi | 295, 296                                |
| Constrained psi | 294, 295                                |

Other structures used in testing: `1UBQ`, `2LYZ` and `1CRN`.

## API overview

| Area                       | Endpoints                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Authentication             | `/auth/register`, `/auth/login`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/logout`                                                          |
| Passwords                  | `/auth/request-reset`, `/auth/reset-password`, `/auth/change-password`                                                                           |
| Profile and logs           | `/api/profile`, `/api/logs`, `/api/logs/delete`                                                                                                  |
| Dashboard                  | `/api/dashboard/statistics`, `/api/dashboard/jobs`, `/api/dashboard/job/<id>`                                                                    |
| Modelling (login required) | `/api/modelling/submit`, `/api/modelling/job/<id>/download`, `.../cancel`, `.../delete`, `.../details`                                           |
| PDB                        | `/api/pdb/fetch/<code>`                                                                                                                          |
| Demo (no login)            | `/api/demo/pdb/search`, `/api/demo/pdb/fetch/<code>`, `/api/demo/modelling/prepare`, `/api/demo/modelling/submit`, `/api/demo/job/<id>/download` |

## Troubleshooting

- **OTP email fails with "Connection unexpectedly closed":** the server sends mail over SMTP SSL on port 465, which some networks and antivirus programs block. Try another network, or switch to port 587 with STARTTLS.
- **Old behaviour after changing `.env`:** an earlier server process may still be using port 8000. Stop it fully and restart.
- **"Zero degrees of freedom, cannot target":** too many torsions are constrained for the segment length. Constrain fewer residues or choose a longer segment.

## Known limitations

- Jobs run synchronously in the request, so a long job holds the request open. There is no job queue yet.
- Demo jobs are stored in memory and are lost when the server restarts.
- Sessions are stored on the filesystem, so the backend runs as a single instance.
- The frontend has hard-coded `localhost` API addresses in some files.
- There is no automated test suite. Testing was manual, across four PDB structures.

## Future work

Batch processing of several proteins, role-based access control with an admin role, a background job queue, cloud deployment, and automated tests.

## Acknowledgements

- MATLAB loop-modelling algorithm: Dr Steven Hayward, University of East Anglia
- Structures: RCSB Protein Data Bank
- Viewers: 3Dmol.js and NGL Viewer
- Breached-password data: Have I Been Pwned

## Licence
