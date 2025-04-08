import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>Página Não Encontrada</ErrorTitle>
        <ErrorMessage>
          A página que você está procurando não existe ou foi movida.
        </ErrorMessage>
        <Link to="/">
          <Button variant="primary">
            <i className="fas fa-home"></i> Voltar para o Dashboard
          </Button>
        </Link>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gradient-subtle-gray);
  padding: var(--space-6);
  
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

const NotFoundContent = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  padding: var(--space-8);
  border-radius: var(--radius-2xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  color: var(--teal-900);
  margin-bottom: var(--space-4);
  opacity: 0.3;
  font-family: var(--font-heading);
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: var(--space-4);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  font-size: 1.1rem;
`;

export default NotFound;
