import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ expanded, onToggle }) => {
  // Determina se estamos em modo desktop
  const isDesktop = window.innerWidth >= 768;
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Navigation links configuration
  const navLinks = [
    { path: '/', icon: 'fa-home', label: 'Dashboard' },
    { path: '/agenda', icon: 'fa-calendar-alt', label: 'Agenda' },
    { path: '/patients', icon: 'fa-users', label: 'Pacientes' },
    { path: '/new-consultation', icon: 'fa-plus', label: 'Nova Consulta', requiresPatient: true },
    { path: '/documentation', icon: 'fa-file-alt', label: 'Documentação', requiresPatient: true },
    { path: '/library', icon: 'fa-folder', label: 'Repositório', requiresPatient: true },
  ];

  // Check if there's a selected patient
  const hasSelectedPatient = !!localStorage.getItem('vintra_selected_patient');

  return (
    <SidebarContainer expanded={expanded || isDesktop}>
      {/* Botão de toggle oculto em desktop */}
      <SidebarToggle onClick={onToggle} className={isDesktop ? 'desktop-hidden' : ''}>
        <i className="fas fa-bars"></i>
      </SidebarToggle>
      
      <SectionTitle expanded={expanded || isDesktop}>Navegação</SectionTitle>
      <SidebarMenu>
        {navLinks.map((link) => {
          const isDisabled = link.requiresPatient && !hasSelectedPatient;
          
          return (
            <SidebarLink
              key={link.path}
              to={isDisabled ? '#' : link.path}
              className={({ isActive }) => (isActive && !isDisabled ? 'active' : '') + (isDisabled ? ' disabled' : '')}
              expanded={expanded || isDesktop}
              onClick={e => isDisabled && e.preventDefault()}
              title={isDisabled ? 'Selecione um paciente primeiro' : link.label}
            >
              <IconContainer>
                <i className={`fas ${link.icon}`}></i>
              </IconContainer>
              <LinkText expanded={expanded || isDesktop}>{link.label}</LinkText>
              
              {isDisabled && (expanded || isDesktop) && (
                <RequiresPatientIndicator>
                  <i className="fas fa-user-lock"></i>
                </RequiresPatientIndicator>
              )}
            </SidebarLink>
          );
        })}
      </SidebarMenu>
      
      <SidebarFooter>
        <UserInfo expanded={expanded || isDesktop}>
          <UserAvatar>
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
          </UserAvatar>
          {(expanded || isDesktop) && <UserName>{currentUser?.name || 'Usuário'}</UserName>}
        </UserInfo>
      </SidebarFooter>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: ${props => props.expanded ? '250px' : '60px'};
  background-color: var(--teal-950);
  display: flex;
  flex-direction: column;
  transition: transform var(--duration-lg) var(--ease-in-out), width var(--duration-lg) var(--ease-in-out);
  overflow: hidden;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  flex-shrink: 0;
  transform: translateX(${props => props.expanded ? '0' : '-100%'});

  @media (max-width: 768px) {
    width: 85%;
    box-shadow: ${props => props.expanded ? 'var(--shadow-xl)' : 'none'};
  }

  /* Right border */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(6, 182, 212, 0.5),
      transparent);
    opacity: 0.4;
  }
`;

const SidebarToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  cursor: pointer;
  color: var(--text-on-dark);
  transition: all var(--duration-md) var(--ease-gentle);
  flex-shrink: 0;
  
  &:hover {
    color: var(--teal-300);
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  /* Esconde em desktop */
  &.desktop-hidden {
    @media (min-width: 768px) {
      display: none;
    }
  }
`;

const SectionTitle = styled.h3`
  color: var(--teal-200);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: var(--space-5) var(--space-4) var(--space-2);
  opacity: ${props => props.expanded ? 0.8 : 0};
  transition: opacity var(--duration-lg) var(--ease-in-out);
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-2);
  flex: 1;
  gap: var(--space-3);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: var(--space-5); /* Adiciona espaço acima do menu */
`;

const IconContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  transition: transform var(--duration-md) var(--ease-out);
  flex-shrink: 0;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-3);
  color: var(--text-on-dark);
  text-decoration: none;
  transition: all var(--duration-md) var(--ease-gentle);
  white-space: nowrap;
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  opacity: 0.7;
  
  /* Active indicator line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--teal-400);
    transform: scaleY(0);
    transition: transform var(--duration-md) var(--ease-gentle);
    opacity: 0;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-on-dark);
    opacity: 1;
  }
  
  &.active {
    background-color: rgba(6, 182, 212, 0.15);
    color: var(--teal-300);
    font-weight: 500;
    opacity: 1;
    
    &::before {
      transform: scaleY(0.6);
      opacity: 1;
    }
  }
  
  &:hover ${IconContainer} {
    transform: translateY(-1px);
  }
  
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
    
    &:hover ${IconContainer} {
      transform: none;
    }
  }
`;

const LinkText = styled.span`
  opacity: ${props => props.expanded ? 1 : 0};
  transform: ${props => props.expanded ? 'translateX(0)' : 'translateX(-10px)'};
  transition: all var(--duration-lg) var(--ease-in-out);
`;

const RequiresPatientIndicator = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-on-dark);
  opacity: 0.6;
`;

const SidebarFooter = styled.div`
  padding: var(--space-4) var(--space-2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  color: var(--text-on-dark);
  opacity: 0.8;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(103, 232, 249, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 0.875rem;
`;

const UserName = styled.div`
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default Sidebar;
