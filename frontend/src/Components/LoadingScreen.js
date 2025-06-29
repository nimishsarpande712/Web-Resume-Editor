import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Circle = styled.div`
  width: 120px;
  height: 120px;
  border: 8px solid #ffffff15;
  border-top: 8px solid #fff;
  border-radius: 50%;
  margin: 0 auto 30px;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    border-width: 6px;
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    border-width: 5px;
    margin-bottom: 20px;
  }
`;

const LoadingText = styled.h2`
  font-size: 28px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-weight: 600;
  letter-spacing: 4px;
  opacity: 0;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    letter-spacing: 2px;
  }
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const Ripple = styled.div`
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ${ripple} 3s infinite;
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  
  &:nth-child(2) {
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    animation-delay: 2s;
  }
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    top: -75px;
    left: -75px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    top: -60px;
    left: -60px;
  }
`;

export function LoadingScreen({ onComplete }) {
  useEffect(() => {
    // Rotate animation for the circle
    gsap.to('.loading-circle', {
      duration: 1.5,
      rotation: 360,
      repeat: -1,
      ease: 'none'
    });

    // Text fade in with bounce
    gsap.to('.loading-text', {
      duration: 1.2,
      opacity: 1,
      y: 0,
      ease: 'bounce.out'
    });

    // Exit animation
    const tl = gsap.timeline({ delay: 2.5 });
    tl.to('.loading-circle, .loading-text', {
      duration: 0.6,
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      ease: 'power2.in'
    })
    .to('.loading-screen', {
      duration: 0.8,
      y: '-100%',
      ease: 'power2.inOut',
      onComplete
    });
  }, [onComplete]);

  return (
    <LoadingContainer className="loading-screen">
      <RippleContainer>
        <Ripple />
        <Ripple />
        <Ripple />
      </RippleContainer>
      <LoadingContent>
        <Circle className="loading-circle" />
        <LoadingText className="loading-text">
          RESUME EDITOR
        </LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
}
