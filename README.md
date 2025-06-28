# Web-Based Resume Editor

This repository contains a web-based Resume Editor application with two main parts:

- **Backend**: A FastAPI server that provides endpoints for AI-enhancement and resume persistence.
- **Frontend**: A React application (`Frontend/resume-editor`) that allows users to upload, edit, enhance, save, and download resumes.

---

## Project Structure

```
/Backend
  /venv             # Python virtual environment and project files
    main.py         # FastAPI application
    requirements.txt# List of backend dependencies
/Frontend
  /resume-editor    # React application created with Create React App
    src/            # Source code for the editor components, API client, etc.
    package.json    # Frontend dependencies and scripts
```

---

## Getting Started

### 1. Backend Setup

1. Open a terminal in the `Backend/venv` directory:

   ```powershell
   cd Backend/venv
   ```

2. (Optional) Create and activate a Python virtual environment if not already active:

   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:

   ```powershell
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`.


### 2. Frontend Setup

1. Open a terminal in the `Frontend/resume-editor` directory:

   ```powershell
   cd "Frontend/resume-editor"
   ```

2. Install Node dependencies:

   ```powershell
   npm install
   ```

3. Start the development server:

   ```powershell
   npm start
   ```

The React app will open at `http://localhost:3000` by default.


## Usage

1. Upload or parse a resume (PDF/DOCX) or use dummy data.
2. Edit fields such as name, summary, experience, education, and skills.
3. Click "Enhance with AI" to refine any section.
4. Save your resume to the backend with the "Save Resume" button.
5. Download the final resume as a JSON file using the "Download JSON" button.

---

## API Endpoints

- `POST /ai-enhance`  – Enhance a section with mock AI.
- `POST /save-resume` – Save the full resume to server memory.
- `GET /get-resume`   – Retrieve the saved resume.

---

## License

This project is provided for demonstration purposes.
