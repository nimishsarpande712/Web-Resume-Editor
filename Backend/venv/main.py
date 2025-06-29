import json
import random
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from docx import Document
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://web-resume-editor.onrender.com"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)



DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

class SectionIn(BaseModel):
    section: str
    content: str

class ExperienceItem(BaseModel):
    company: str
    role: str
    duration: str
    description: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: str
    year: str
    gpa: Optional[str] = None

class Resume(BaseModel):
    name: str
    summary: str
    experience: List[Dict[str, str]]
    education: List[Dict[str, str]]
    skills: List[str]

def parse_document(content) -> dict:
    sections = {"Experience": [], "Education": [], "Skills": []}
    current_section = None
    current_item = {}

    for line in content:
        line = line.strip()
        if not line:
            continue

        if line.lower() in ["experience", "education", "skills"]:
            current_section = line.title()
            continue

        if current_section == "Skills":
            sections["Skills"] = [s.strip() for s in line.split(",")]
        elif current_section in ["Experience", "Education"]:
            if " - " in line:
                if current_item:
                    sections[current_section].append(current_item)
                current_item = {}
                parts = line.split(" - ")
                if current_section == "Experience":
                    current_item.update({"company": parts[0], "role": parts[1] if len(parts) > 1 else ""})
                else:
                    current_item.update({"institution": parts[0], "degree": parts[1] if len(parts) > 1 else ""})
            elif current_item:
                if "description" not in current_item:
                    current_item["description"] = line
                    current_item["duration"] = ""

    if current_item:
        sections[current_section].append(current_item)

    return {
        "name": content[0] if content else "Untitled",
        "summary": content[1] if len(content) > 1 else "",
        "experience": sections["Experience"],
        "education": sections["Education"],
        "skills": sections["Skills"]
    }

def parse_docx(file) -> dict:
    doc = Document(file)
    content = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return parse_document(content)

def enhance_text(text: str, section_type: str) -> str:
    enhancements = {
        "name": [
            "Mr. ",
            "Ms. ",
            "Dr. "
        ],
        "summary": [
            "Results-driven professional with proven expertise in ",
            "Dynamic leader with demonstrated success in ",
            "Innovative professional showcasing extensive experience in ",
            "Accomplished specialist with deep knowledge in ",
            "Strategic thinker with comprehensive background in "
        ],
        "experience": {
            "company": ["Leading technology firm ", "Industry pioneer ", "Global organization ", "Renowned company ", "Innovative enterprise "],
            "role": ["Senior ", "Lead ", "Principal ", "Chief ", "Executive "],
            "duration": ["", "", ""],  # Keep duration as is
            "description": [
                "Successfully spearheaded initiatives in ",
                "Led cross-functional teams to deliver ",
                "Drove significant improvements in ",
                "Architected and implemented solutions for ",
                "Collaborated effectively to achieve "
            ]
        },
        "education": {
            "institution": ["Prestigious ", "Renowned ", "Leading ", "Distinguished ", "Top-tier "],
            "degree": ["Advanced degree in ", "Specialized qualification in ", "Professional certification in ", "Expert-level education in ", "Comprehensive studies in "],
            "year": ["Graduated ", "Completed ", "Class of ", "Finished ", "Earned "],
            "gpa": ["Academic excellence: ", "Outstanding performance: ", "Superior achievement: ", "High academic standing: ", "Excellent grades: "]
        },
        "skills": [
            "Advanced proficiency in ",
            "Expert-level knowledge of ",
            "Professional mastery of ",
            "Specialized expertise in ",
            "Deep understanding of "
        ]
    }

    section = section_type.lower()
    
    if section not in enhancements:
        return text
    
    try:
        if section == "skills":
            # Handle skills as comma-separated string
            if isinstance(text, str):
                skills = [s.strip() for s in text.split(',') if s.strip()]
                enhanced_skills = []
                for skill in skills:
                    prefix = random.choice(enhancements["skills"])
                    enhanced_skills.append(prefix + skill)
                return ', '.join(enhanced_skills)
            return text
            
        elif section in ["name", "summary"]:
            # Handle simple text enhancement
            if text.strip():
                prefix = random.choice(enhancements[section])
                return prefix + text
            return text
            
        elif section in ["experience", "education"]:
            # Handle complex objects (arrays of dictionaries)
            try:
                data = json.loads(text) if isinstance(text, str) else text
                
                if isinstance(data, list):
                    enhanced_items = []
                    for item in data:
                        enhanced_item = {}
                        for key, value in item.items():
                            if key in enhancements[section] and value and value.strip():
                                # Don't enhance duration for experience
                                if section == "experience" and key == "duration":
                                    enhanced_item[key] = value
                                else:
                                    prefix = random.choice(enhancements[section][key])
                                    enhanced_item[key] = prefix + str(value)
                            else:
                                enhanced_item[key] = value
                        enhanced_items.append(enhanced_item)
                    return json.dumps(enhanced_items)
                
                return text
                
            except (json.JSONDecodeError, KeyError) as e:
                print(f"Enhancement error for {section}: {e}")
                return text
    
    except Exception as e:
        print(f"General enhancement error for {section}: {e}")
        return text
    
    return text

@app.post("/ai-enhance")
def ai_enhance(data: SectionIn):
    print(f"=== AI ENHANCE REQUEST ===")
    print(f"Section: {data.section}")
    print(f"Content type: {type(data.content)}")
    print(f"Content: {data.content}")
    
    enhanced = enhance_text(data.content, data.section)
    
    print(f"Enhanced result: {enhanced}")
    print(f"Enhanced type: {type(enhanced)}")
    print(f"=== END REQUEST ===")
    
    return {"enhanced": enhanced}

@app.post("/save-resume")
def save_resume(resume: Resume):
    with open(DATA_DIR / "resume.json", "w") as f:
        json.dump(resume.model_dump(), f)
    return {"status": "Resume saved successfully"}

@app.get("/get-resume")
def get_resume():
    try:
        with open(DATA_DIR / "resume.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def create_docx(resume: Resume) -> bytes:
    doc = Document()
    
    # Name
    doc.add_heading(resume.name, 0)
    
    # Summary
    doc.add_heading('Summary', level=1)
    doc.add_paragraph(resume.summary)
    
    # Experience
    doc.add_heading('Experience', level=1)
    for exp in resume.experience:
        p = doc.add_paragraph()
        p.add_run(f"{exp['company']} - {exp['role']}\n").bold = True
        p.add_run(f"Duration: {exp['duration']}\n")
        if exp.get('description'):
            p.add_run(exp['description'])
        doc.add_paragraph("")
    
    # Education
    doc.add_heading('Education', level=1)
    for edu in resume.education:
        p = doc.add_paragraph()
        p.add_run(f"{edu['institution']}\\n").bold = True
        p.add_run(f"{edu['degree']} - {edu['year']}\\n")
        if edu.get('gpa'):
            p.add_run(f"GPA: {edu['gpa']}")
        doc.add_paragraph()
    
    # Skills
    doc.add_heading('Skills', level=1)
    doc.add_paragraph(', '.join(resume.skills))
    
    # Save to bytes
    doc_stream = io.BytesIO()
    doc.save(doc_stream)
    doc_stream.seek(0)
    return doc_stream.getvalue()

def create_pdf(resume: Resume) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    y = 750  # Starting y position
    
    # Name
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, y, resume.name)
    y -= 40
    
    # Summary
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Summary")
    y -= 20
    c.setFont("Helvetica", 12)
    words = resume.summary.split()
    line = []
    for word in words:
        line.append(word)
        if len(' '.join(line)) > 70:  # Wrap text
            c.drawString(50, y, ' '.join(line[:-1]))
            line = [line[-1]]
            y -= 15
    if line:
        c.drawString(50, y, ' '.join(line))
    y -= 30
    
    # Experience
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Experience")
    y -= 20
    for exp in resume.experience:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, f"{exp['company']} - {exp['role']}")
        y -= 15
        c.setFont("Helvetica", 12)
        c.drawString(50, y, f"Duration: {exp['duration']}")
        y -= 15
        if exp.get('description'):
            words = exp['description'].split()
            line = []
            for word in words:
                line.append(word)
                if len(' '.join(line)) > 70:
                    c.drawString(50, y, ' '.join(line[:-1]))
                    line = [line[-1]]
                    y -= 15
            if line:
                c.drawString(50, y, ' '.join(line))
        y -= 20
    
    # Education
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Education")
    y -= 20
    for edu in resume.education:
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, edu['institution'])
        y -= 15
        c.setFont("Helvetica", 12)
        c.drawString(50, y, f"{edu['degree']} - {edu['year']}")
        y -= 15
        if edu.get('gpa'):
            c.drawString(50, y, f"GPA: {edu['gpa']}")
        y -= 20
    
    # Skills
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Skills")
    y -= 20
    c.setFont("Helvetica", 12)
    skills_text = ', '.join(resume.skills)
    words = skills_text.split()
    line = []
    for word in words:
        line.append(word)
        if len(' '.join(line)) > 70:
            c.drawString(50, y, ' '.join(line[:-1]))
            line = [line[-1]]
            y -= 15
    if line:
        c.drawString(50, y, ' '.join(line))
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()

@app.post("/export-resume/{format}")
async def export_resume(format: str, resume: Resume):
    try:
        if format == "json":
            return resume.model_dump()
        elif format == "docx":
            docx_bytes = create_docx(resume)
            return StreamingResponse(
                io.BytesIO(docx_bytes),
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={"Content-Disposition": f'attachment; filename="{resume.name.replace(" ", "_")}_resume.docx"'
                }
            )
        elif format == "pdf":
            pdf_bytes = create_pdf(resume)
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{resume.name.replace(" ", "_")}_resume.pdf"'
                }
            )
        
        raise HTTPException(status_code=400, detail="Unsupported format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
