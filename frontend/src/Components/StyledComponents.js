import styled, { keyframes } from 'styled-components';
import { Paper } from '@mui/material';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const buttonHover = keyframes`
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.05) translateY(-3px); }
  100% { transform: scale(1.02) translateY(-2px); }
`;

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e44ad 50%, #9b59b6 75%, #e74c3c 100%);
  color: #f5f5dc;
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
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
      rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(80px) saturate(180%);
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2.5rem;
  margin: 1.5rem 0;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(100px) saturate(200%);
  border: 2px solid rgba(245, 245, 220, 0.2);
  border-radius: 30px !important;
  color: #f5f5dc !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.2),
    inset 0 0 0 1px rgba(245, 245, 220, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
      rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(60px);
    border-radius: 30px;
    z-index: -2;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1) !important;
    box-shadow: 
      0 12px 40px 0 rgba(31, 38, 135, 0.25),
      inset 0 0 0 1px rgba(245, 245, 220, 0.2);
    border-color: rgba(245, 245, 220, 0.3);
  }

  animation: ${slideIn} 1s ease-out forwards;
  opacity: 0;
  animation-delay: var(--delay);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1.2rem 0;
    border-radius: 25px !important;
    border-width: 2px;
    
    &::before {
      border-radius: 29px;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
    }
    
    &::after {
      border-radius: 25px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem 0;
    border-radius: 20px !important;
    border-width: 2px;
    
    &::before {
      border-radius: 24px;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
    }
    
    &::after {
      border-radius: 20px;
    }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #f5f5dc 30%, #fff 50%, #f5f5dc 70%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
  text-shadow: 0 0 30px rgba(245, 245, 220, 0.3);
  opacity: 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
  }
`;

const Button = styled.button`
  background: rgba(245, 245, 220, 0.95);
  backdrop-filter: blur(60px) saturate(180%);
  color: #8e44ad;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 8px 30px 0 rgba(245, 245, 220, 0.4),
    0 0 40px rgba(255, 215, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.6),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  margin: 10px;
  min-width: 140px;
  text-transform: uppercase;
  letter-spacing: 0.8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -120%;
    width: 120%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(142, 68, 173, 0.2), 
      transparent);
    transition: left 0.6s;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 19px;
    border: 3px solid transparent;
    background: linear-gradient(45deg, 
      rgba(255, 215, 0, 0.5), 
      transparent, 
      rgba(255, 215, 0, 0.5),
      transparent,
      rgba(255, 215, 0, 0.5)) border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    opacity: 0;
    transition: opacity 0.4s ease;
    background-size: 300% 300%;
  }

  & > * {
    position: relative;
    z-index: 2;
  }

  &:hover {
    animation: ${buttonHover} 0.4s ease forwards;
    background: rgba(245, 245, 220, 0.98);
    backdrop-filter: blur(80px) saturate(200%);
    box-shadow: 
      0 12px 40px 0 rgba(245, 245, 220, 0.5),
      0 0 50px rgba(255, 215, 0, 0.4),
      inset 0 3px 0 rgba(255, 255, 255, 0.7),
      inset 0 -3px 0 rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.6);
    transform: translateY(-2px) scale(1.02);
    
    &::before {
      left: 120%;
    }
    
    &::after {
      opacity: 0.8;
    }
  }

  &:active {
    transform: scale(1.02) translateY(-1px);
    box-shadow: 
      0 8px 25px 0 rgba(245, 245, 220, 0.5),
      0 0 30px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    background: rgba(245, 245, 220, 0.4);
    color: rgba(142, 68, 173, 0.5);
    cursor: not-allowed;
    transform: none;
    backdrop-filter: blur(30px);
    
    &:hover {
      animation: none;
      transform: none;
      box-shadow: 0 4px 15px 0 rgba(245, 245, 220, 0.3);
      
      &::before {
        left: -120%;
      }
      
      &::after {
        opacity: 0;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
    min-width: 120px;
    border-radius: 14px;
    
    &::after {
      border-radius: 17px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    margin: 8px;
    min-width: 110px;
    border-radius: 12px;
    
    &::after {
      border-radius: 15px;
    }
  }
`;

export function StyledContainer({ children }) {
  const containerRef = useRef();
  const titleRef = useRef();

  useEffect(() => {
    // Animate title with enhanced effects
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3
    });

    // Stagger animate papers with golden glow
    gsap.from('.section-paper', {
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.5
    });

    // Add floating animation to papers
    gsap.to('.section-paper', {
      y: "random(-5, 5)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: "random(0, 2)"
    });
  }, []);

  return (
    <Container ref={containerRef}>
      <Title ref={titleRef}>Resume Editor</Title>
      {children}
    </Container>
  );
}

export { StyledPaper as Paper, Button };
