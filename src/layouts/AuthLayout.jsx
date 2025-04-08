import React from 'react';
import styled from 'styled-components';

const AuthLayout = ({ children }) => {
  return (
    <AuthContainer>
      <AuthContent>
        {children}
      </AuthContent>
    </AuthContainer>
  );
};

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--gradient-subtle-gray);
  padding: var(--space-4);
  
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(120deg,
        rgba(255, 255, 255, 0) 20%,
        rgba(103, 232, 249, 0.03) 50%,
        rgba(255, 255, 255, 0) 80%);
    opacity: 0.4;
    z-index: -1;
    animation: subtleGlow 25s infinite alternate ease-in-out;
  }
  
  @keyframes subtleGlow {
    0% { transform: scale(1) translateX(-10%) translateY(-5%); }
    100% { transform: scale(1.1) translateX(10%) translateY(5%); }
  }
`;

const AuthContent = styled.div`
  width: 100%;
  max-width: 400px;
`;

export default AuthLayout;
