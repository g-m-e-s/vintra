import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { showSuccess } = useUI();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Por favor, digite a senha de acesso.');
      return;
    }

    try {
      const success = await login(password);
      
      if (success) {
        showSuccess('Login Bem-sucedido', 'Bem-vindo ao VINTRA!');
        navigate('/');
      } else {
        setError('Senha incorreta. Por favor, tente novamente.');
        animateErrorShake();
      }
    } catch (err) {
      setError(err.message || 'Erro ao efetuar login. Por favor, tente novamente.');
      animateErrorShake();
    }
  };

  const animateErrorShake = () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.classList.add('shake-animation');
      setTimeout(() => {
        loginForm.classList.remove('shake-animation');
      }, 500);
    }
  };

  return (
    <LoginContainer>
      <Logo src="/logo.png" alt="VINTRA Logo" />
      <LoginHeading>VINTRA</LoginHeading>
      <LoginSubheading>Análise Dimensional Clínica</LoginSubheading>
      
      <LoginForm id="loginForm" onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="password">Senha de Acesso</FormLabel>
          <FormInput
            type="password"
            id="password"
            placeholder="Digite sua senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
        
        <Button 
          variant="primary" 
          type="submit" 
          fullWidth 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  width: 100%;
  max-width: 380px;
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface-white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
  transition: transform var(--duration-lg) var(--ease-out);
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
  
  &.shake-animation {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: var(--space-8);
  transition: all var(--duration-lg) var(--ease-gentle);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06));
`;

const LoginHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  text-align: center;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  font-family: var(--font-heading);
`;

const LoginSubheading = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  text-align: center;
`;

const LoginForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-5);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--space-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
`;

const FormInput = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background-color: var(--gray-100);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  color: var(--text-primary);
  transition: all var(--duration-md) var(--ease-gentle);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
  
  &:focus {
    outline: none;
    background-color: var(--gray-50);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02),
                0 0 0 2px var(--accent-light);
    border-color: var(--accent);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error);
  font-size: 0.75rem;
  margin-top: var(--space-2);
`;

export default Login;
