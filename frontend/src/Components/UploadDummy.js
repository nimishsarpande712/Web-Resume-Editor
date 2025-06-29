import { useState } from "react";
import styled, { keyframes } from 'styled-components';
import { Paper } from './StyledComponents';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const UploadContainer = styled(Paper)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e44ad 50%, #9b59b6 75%, #e74c3c 100%) !important;
    backdrop-filter: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 2rem;
    border-radius: 0 !important;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
            rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(60px) saturate(180%);
        z-index: 1;
    }
    
    & > * {
        position: relative;
        z-index: 2;
    }
    
    @media (max-width: 768px) {
        padding: 1.5rem;
        gap: 1.5rem;
    }
    
    @media (max-width: 480px) {
        padding: 1rem;
        gap: 1rem;
    }
    /* Disable hover effects inherited from Paper */
    &:hover {
        box-shadow: none !important;
        transform: none !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e44ad 50%, #9b59b6 75%, #e74c3c 100%) !important;
    }
`;

const UploadArea = styled.div`
    border: 3px dashed rgba(245, 245, 220, 0.8);
    border-radius: 30px;
    padding: 4rem 3rem;
    width: 80%;
    max-width: 600px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(100px) saturate(250%);
    border-radius: 30px;
    box-shadow: 
        0 20px 80px 0 rgba(0, 0, 0, 0.4),
        0 0 60px rgba(245, 245, 220, 0.3),
        inset 0 2px 0 rgba(255, 255, 255, 0.3),
        inset 0 -2px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border-radius: 33px;
        background: linear-gradient(45deg, 
            rgba(245, 245, 220, 0.3), 
            transparent);
        z-index: -2;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(40px);
        border-radius: 30px;
        z-index: -1;
    }

    @media (max-width: 768px) {
        padding: 3rem 2rem;
        width: 90%;
        border-radius: 25px;
        
        &::before {
            border-radius: 28px;
        }
        
        &::after {
            border-radius: 25px;
        }
    }
    
    @media (max-width: 480px) {
        padding: 2rem 1.5rem;
        width: 95%;
        border-radius: 20px;
        
        &::before {
            border-radius: 23px;
        }
        
        &::after {
            border-radius: 20px;
        }
    }
`;

const Title = styled.h1`
    color: #f5f5dc;
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
    background: linear-gradient(45deg, #f5f5dc 30%, #fff 50%, #f5f5dc 70%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 3s linear infinite;
    text-shadow: 0 0 30px rgba(245, 245, 220, 0.3);
    
    @media (max-width: 768px) {
        font-size: 2.8rem;
    }
    
    @media (max-width: 480px) {
        font-size: 2.2rem;
    }
`;

const SubTitle = styled.p`
    color: rgba(245, 245, 220, 0.9);
    margin-bottom: 2rem;
    font-size: 1.2rem;
    font-weight: 300;
    
    @media (max-width: 768px) {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 480px) {
        font-size: 1rem;
        margin-bottom: 1rem;
    }
`;

const StyledButton = styled.button`
    background: rgba(245, 245, 220, 0.15);
    backdrop-filter: blur(80px) saturate(200%);
    color: #f5f5dc;
    border: 2px solid rgba(245, 245, 220, 0.3);
    border-radius: 18px;
    padding: 16px 36px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 
        0 12px 40px 0 rgba(0, 0, 0, 0.3),
        0 0 30px rgba(245, 245, 220, 0.2),
        inset 0 2px 0 rgba(255, 255, 255, 0.1),
        inset 0 -2px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    margin: 12px;
    min-width: 160px;
    text-transform: uppercase;
    letter-spacing: 1px;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg,
            rgba(255, 255, 255, 0.1),
            transparent);
        z-index: -1;
    }

    & > * {
        position: relative;
        z-index: 2;
    }

    &:active {
        box-shadow: 
            0 8px 30px 0 rgba(0, 0, 0, 0.3),
            0 0 20px rgba(245, 245, 220, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    &:disabled {
        background: rgba(142, 68, 173, 0.5);
        color: rgba(142, 68, 173, 0.5);
        cursor: not-allowed;
        transform: none;
        backdrop-filter: blur(20px);
        box-shadow: 0 6px 20px 0 rgba(245, 245, 220, 0.2);
        
        &:hover {
            transform: none;
            
            &::before {
                left: none;
            }
            
            &::after {
                opacity: 0;
            }
        }
    }
    
    @media (max-width: 768px) {
        padding: 14px 32px;
        font-size: 1rem;
        min-width: 140px;
        border-radius: 15px;
        margin: 10px;
        
        &::after {
            border-radius: 18px;
        }
    }
    
    @media (max-width: 480px) {
        padding: 12px 28px;
        font-size: 0.95rem;
        margin: 8px;
        min-width: 130px;
        border-radius: 12px;
        
        &::after {
            border-radius: 15px;
        }
    }
`;

const HiddenInput = styled.input`
    display: none;
`;

const FileInfo = styled.div`
    margin-top: 1rem;
    color: rgba(245, 245, 220, 0.8);
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;

const IconWrapper = styled.div`
    animation: ${float} 3s ease-in-out infinite;
    margin-bottom: 1rem;
    
    .MuiSvgIcon-root {
        font-size: 48px;
        color: #f5f5dc;
        filter: drop-shadow(0 0 10px rgba(245, 245, 220, 0.3));
        
        @media (max-width: 768px) {
            font-size: 40px;
        }
        
        @media (max-width: 480px) {
            font-size: 36px;
        }
    }
`;

const UploadText = styled.h3`
    color: #f5f5dc;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 500;
    
    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
    
    @media (max-width: 480px) {
        font-size: 1.1rem;
    }
`;

const SupportText = styled.p`
    color: rgba(245, 245, 220, 0.7);
    margin: 0;
    font-size: 1rem;
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    
    @media (max-width: 480px) {
        gap: 0.5rem;
    }
`;

export function UploadDummy({ onLoad }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const preventDefault = (e) => {
        e.preventDefault();
    };

    const parseResume = () => {
        
        const dummy = {
            name: selectedFile ? selectedFile.name.replace(/\.(pdf|docx)$/, '') : "John Doe",
            summary: "Experienced professional with expertise in...",
            experience: [
                { 
                    company: "Tech Corp",
                    role: "Senior Developer",
                    duration: "2020 - Present",
                    description: "Led development of key features..."
                }
            ],
            education: [
                {
                    institution: "University of Technology",
                    degree: "BSc Computer Science",
                    year: "2019",
                    gpa: "3.8"
                }
            ],
            skills: ["JavaScript", "React", "Python", "FastAPI", "SQL", "Git"],
        };
        onLoad(dummy);
    };

    return (
        <UploadContainer>
            <Title>Resume Editor</Title>
            <SubTitle>Upload your resume or start with a template</SubTitle>
            
            <UploadArea
                onDrop={handleDrop}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                onClick={() => document.getElementById('file-input').click()}
            >
                <IconWrapper>
                    <CloudUploadIcon />
                </IconWrapper>
                <UploadText>
                    {selectedFile ? selectedFile.name : 'Drop your resume here or click to browse'}
                </UploadText>
                <SupportText>
                    Supported formats: PDF, DOCX
                </SupportText>
                <HiddenInput
                    id="file-input"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                />
                {selectedFile && (
                    <FileInfo>
                        Selected: {selectedFile.name}
                    </FileInfo>
                )}
            </UploadArea>

            <ButtonContainer>
                <StyledButton onClick={parseResume} disabled={!selectedFile}>
                    {selectedFile ? 'Parse Resume' : 'Use Template'}
                </StyledButton>
                <StyledButton onClick={() => onLoad({
                    name: "John Doe",
                    summary: "Experienced developer with a passion for creating efficient solutions.",
                    experience: [
                        { company: "ABC Corp", role: "Senior Developer", duration: "2 years", description: "Led development teams..." }
                    ],
                    education: [
                        { institution: "Tech University", degree: "BSc Computer Science", year: "2020", gpa: "3.9" }
                    ],
                    skills: ["JavaScript", "React", "Node.js", "Python", "FastAPI"]
                })}>
                    Use Sample
                </StyledButton>
            </ButtonContainer>
        </UploadContainer>
    );
}