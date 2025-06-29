import './App.css';
import { useState, useEffect } from 'react';
import { SectionEditor } from './Components/SectionEditor';
import { UploadDummy } from './Components/UploadDummy';
import { saveResume, getResume, downloadResume } from './api';
import { StyledContainer, Button } from './Components/StyledComponents';
import { LoadingScreen } from './Components/LoadingScreen';
import styled from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(80px) saturate(180%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '20px',
          color: '#f5f5dc',
          boxShadow: `
            0 15px 50px rgba(0, 0, 0, 0.4), 
            0 0 60px rgba(255, 215, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.15),
            inset 0 -2px 0 rgba(0, 0, 0, 0.1)
          `,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
            `,
            backdropFilter: 'blur(30px)',
            borderRadius: '20px',
            zIndex: -1,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#f5f5dc',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '14px 24px',
          borderRadius: '12px',
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.15)',
            backdropFilter: 'blur(40px)',
            color: '#fff',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
            transition: 'left 0.5s',
          },
          
        },
      },
    },
  },
});

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(80px) saturate(180%);
  border-radius: 25px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.2),
    0 0 60px rgba(255, 215, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.15),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 27px;
    background: linear-gradient(45deg, 
      rgba(255, 215, 0, 0.4), 
      transparent, 
      rgba(255, 215, 0, 0.4),
      transparent,
      rgba(255, 215, 0, 0.4));
    background-size: 300% 300%;
    z-index: -2;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
    backdrop-filter: blur(30px);
    border-radius: 25px;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 15px 50px rgba(0, 0, 0, 0.25),
      0 0 80px rgba(255, 215, 0, 0.4),
      inset 0 3px 0 rgba(255, 255, 255, 0.2),
      inset 0 -3px 0 rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 215, 0, 0.4);
    
    &::before {
      opacity: 0.6;
    }
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.2rem;
    border-radius: 20px;
    
    &::before {
      border-radius: 22px;
    }
    
    &::after {
      border-radius: 20px;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 18px;
    flex-direction: column;
    align-items: center;
    
    &::before {
      border-radius: 20px;
    }
    
    &::after {
      border-radius: 18px;
    }
  }
`;

function App() {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    getResume().then(data => {
      if (data.name) setResume(data);
      setTimeout(() => setIsLoading(false), 2500);
    });
  }, []);

  const updateSection = (sectionKey, value) => {
    setResume(prev => ({ ...prev, [sectionKey]: value }));
  };

  const handleSave = async () => {
    const result = await saveResume(resume); 
    alert(result.status);
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format) => {
    handleDownloadClose();
    try {
      setIsLoading(true);
      await downloadResume(resume, format);
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert(`Failed to download resume as ${format.toUpperCase()}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!resume) return <UploadDummy onLoad={setResume} />;

  return (
    <ThemeProvider theme={customTheme}>
      <StyledContainer>
        <SectionEditor sectionKey="Name" value={resume.name || ''} onChange={(v) => updateSection('name', v)} />
        <SectionEditor sectionKey="Summary" value={resume.summary || ''} onChange={(v) => updateSection('summary', v)} />
        <SectionEditor sectionKey="Experience" value={resume.experience || []} onChange={(v) => updateSection('experience', v)} />
        <SectionEditor sectionKey="Education" value={resume.education || []} onChange={(v) => updateSection('education', v)} />
        <SectionEditor sectionKey="Skills" value={resume.skills || []} onChange={(v) => updateSection('skills', v)} />      <ButtonContainer>
        <Button onClick={handleSave}>Save Resume</Button>
        <Button onClick={handleDownloadClick}>Download Resume</Button>
        <ThemeProvider theme={customTheme}>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDownloadClose}
          >
            <MenuItem onClick={() => handleDownload('json')}>Download as JSON</MenuItem>
            <MenuItem onClick={() => handleDownload('docx')}>Download as DOCX</MenuItem>
            <MenuItem onClick={() => handleDownload('pdf')}>Download as PDF</MenuItem>
          </Menu>
        </ThemeProvider>
      </ButtonContainer>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
