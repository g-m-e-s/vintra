import React from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Barra de navegação para dispositivos móveis
 * Aparece na parte inferior da tela como uma navegação fixa
 * Substitui a necessidade da sidebar em dispositivos móveis
 */
const MobileNavBar = ({ selectedPatient }) => {
  const location = useLocation();
  
  // Links de navegação, similar à sidebar mas otimizada para mobile
  const navLinks = [
    { path: '/', icon: 'fa-home', label: 'Início' },
    { path: '/patients', icon: 'fa-users', label: 'Pacientes' },
    { path: '/new-consultation', icon: 'fa-plus-circle', label: 'Consulta', requiresPatient: true },
    { path: '/documentation', icon: 'fa-file-alt', label: 'Docs', requiresPatient: true },
    { path: '/library', icon: 'fa-folder', label: 'Repo', requiresPatient: true }
  ];
  
  // Verifica se há um paciente selecionado
  const hasSelectedPatient = !!selectedPatient;

  return (
    <NavBarContainer>
      {navLinks.map((link) => {
        const isDisabled = link.requiresPatient && !hasSelectedPatient;
        const isActive = location.pathname === link.path;
        
        return (
          <NavItem
            key={link.path}
            to={isDisabled ? '#' : link.path}
            className={isActive && !isDisabled ? 'active' : '' + (isDisabled ? ' disabled' : '')}
            onClick={e => {
              if (isDisabled) {
                e.preventDefault();
              }
            }}
            data-testid={`mobile-nav-${link.path.replace('/', '')}`}
          >
            <NavIcon className={`fas ${link.icon}`} isActive={isActive} />
            <NavLabel isActive={isActive}>{link.label}</NavLabel>
            
            {isDisabled && (
              <DisabledOverlay>
                <i className="fas fa-lock"></i>
              </DisabledOverlay>
            )}
          </NavItem>
        );
      })}
    </NavBarContainer>
  );
};

// Animações
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

// Estilos
const NavBarContainer = styled.nav`
  display: none; /* Oculto por padrão */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(var(--blur-md));
  height: 60px;
  border-top: 1px solid var(--border-color-light);
  z-index: 50;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  justify-content: space-around;
  align-items: center;
  animation: ${slideUp} 0.3s var(--ease-out);
  
  /* Gradiente sutil na borda superior */
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(6, 182, 212, 0.3) 50%,
      transparent 100%);
  }
  
  /* Display apenas em mobile */
  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled(NavLink)`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-secondary);
  position: relative;
  transition: all 0.2s var(--ease-gentle);
  padding: var(--space-1) 0;
  
  &.active {
    color: var(--teal-600);
    
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 40%;
      height: 3px;
      background: var(--teal-500);
      border-radius: var(--radius-full);
    }
  }
  
  &.disabled {
    opacity: 0.5;
  }
`;

const NavIcon = styled.i`
  font-size: 1.25rem;
  margin-bottom: 4px;
  color: ${props => props.isActive ? 'var(--teal-600)' : 'var(--text-secondary)'};
  transition: all 0.2s var(--ease-gentle);
  
  ${NavItem}:hover & {
    transform: translateY(-2px);
  }
`;

const NavLabel = styled.span`
  font-size: 0.7rem;
  font-weight: ${props => props.isActive ? '500' : 'normal'};
`;

const DisabledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  
  i {
    font-size: 0.875rem;
    opacity: 0.7;
  }
`;

export default MobileNavBar;
