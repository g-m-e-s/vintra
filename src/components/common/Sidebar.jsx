import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ expanded, visible, isMobile, onToggle }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Navigation links configuration
  const navLinks = [
    { path: '/', icon: 'fa-home', label: 'Dashboard' },
    { path: '/patients', icon: 'fa-users', label: 'Pacientes' },
    { path: '/new-consultation', icon: 'fa-plus', label: 'Nova Consulta', requiresPatient: true },
    { path: '/documentation', icon: 'fa-file-alt', label: 'Documentação', requiresPatient: true },
    { path: '/library', icon: 'fa-folder', label: 'Repositório', requiresPatient: true },
  ];

  // Atualiza o paciente selecionado quando mudanças ocorrem
  useEffect(() => {
    const updateSelectedPatient = () => {
      const storedPatient = localStorage.getItem('vintra_selected_patient');
      if (storedPatient) {
        try {
          setSelectedPatient(JSON.parse(storedPatient));
        } catch (e) {
          setSelectedPatient(null);
        }
      } else {
        setSelectedPatient(null);
      }
    };

    // Verificar inicialmente
    updateSelectedPatient();

    // Configurar listener para storage change
    window.addEventListener('storage', updateSelectedPatient);
    
    // Configurar intervalo para verificar mudanças de paciente
    const interval = setInterval(() => {
      const refresh = localStorage.getItem('vintra_sidebar_refresh');
      if (refresh) {
        updateSelectedPatient();
        localStorage.removeItem('vintra_sidebar_refresh');
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', updateSelectedPatient);
      clearInterval(interval);
    };
  }, []);

  // Check if there's a selected patient
  const hasSelectedPatient = !!selectedPatient;

  return (
    <SidebarContainer 
      expanded={expanded} 
      visible={visible} 
      isMobile={isMobile}
      aria-hidden={!visible}
      data-testid="sidebar"
    >
      {/* Cabeçalho da Sidebar */}
      <SidebarHeader>
        <SidebarBrand>
          <BrandIcon>V</BrandIcon>
          <BrandText visible={expanded}>VINTRA</BrandText>
        </SidebarBrand>
        
        {/* Botão de fechar sempre visível quando a sidebar está visível */}
        <CloseButton onClick={onToggle}>
          <i className="fas fa-times"></i>
        </CloseButton>
      </SidebarHeader>
      
      {/* Informações do paciente selecionado */}
      {hasSelectedPatient && (
        <PatientInfoCard expanded={expanded || isMobile}>
          <PatientAvatar>{selectedPatient.name.charAt(0)}</PatientAvatar>
          <PatientDetails>
            <PatientName>{selectedPatient.name}</PatientName>
            <PatientId>ID: {selectedPatient.id.replace('patient-', '')}</PatientId>
          </PatientDetails>
        </PatientInfoCard>
      )}
      
      <SectionTitle visible={expanded || isMobile}>Navegação</SectionTitle>
      <SidebarMenu>
        {navLinks.map((link) => {
          const isDisabled = link.requiresPatient && !hasSelectedPatient;
          const isActive = location.pathname === link.path;
          
          return (
            <SidebarLink
              key={link.path}
              to={isDisabled ? '#' : link.path}
              className={isActive && !isDisabled ? 'active' : '' + (isDisabled ? ' disabled' : '')}
              expanded={expanded || isMobile}
              onClick={e => {
                if (isDisabled) {
                  e.preventDefault();
                  return;
                }
                
                // Fechar sidebar ao navegar (sempre em mobile, opcional em desktop)
                if (isMobile || window.innerWidth < 1200) {
                  onToggle();
                }
              }}
              data-testid={`nav-link-${link.path.replace('/', '')}`}
              title={isDisabled ? 'Selecione um paciente primeiro' : link.label}
            >
              <IconContainer isActive={isActive}>
                <i className={`fas ${link.icon}`}></i>
              </IconContainer>
              <LinkText visible={expanded || isMobile}>{link.label}</LinkText>
              
              {isDisabled && (expanded || isMobile) && (
                <RequiresPatientIndicator>
                  <i className="fas fa-user-lock"></i>
                </RequiresPatientIndicator>
              )}
            </SidebarLink>
          );
        })}
      </SidebarMenu>
      
      <SidebarFooter>
        <UserInfo expanded={expanded || isMobile}>
          <UserAvatar>
            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
          </UserAvatar>
          {(expanded || isMobile) && (
            <UserName>{currentUser?.name || 'Usuário'}</UserName>
          )}
        </UserInfo>
      </SidebarFooter>
    </SidebarContainer>
  );
};

// Animations
const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--teal-950);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s var(--ease-elastic);
  overflow: hidden;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  flex-shrink: 0;
  box-shadow: ${props => props.visible ? 'var(--shadow-lg)' : 'none'};
  
  /* Em mobile, usa animação deslizante */
  transform: translateX(${props => props.visible ? '0' : '-100%'});
  animation: ${props => props.visible ? slideIn : 'none'} 0.3s var(--ease-elastic);

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
  
  /* Ajustes especiais para mobile */
  @media (max-width: 768px) {
    width: 85%;
    max-width: 300px;
    transform: translateX(${props => props.visible ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  animation: ${fadeIn} 0.5s ease;
`;

const BrandIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--teal-400), var(--teal-600));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
`;

const BrandText = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--teal-100);
  font-family: var(--font-heading);
  letter-spacing: 0.05em;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--teal-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
    color: white;
  }
`;

// Card do paciente selecionado
const PatientInfoCard = styled.div`
  margin: var(--space-4) var(--space-2);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PatientAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--teal-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
`;

const PatientDetails = styled.div`
  overflow: hidden;
`;

const PatientName = styled.div`
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PatientId = styled.div`
  color: var(--teal-200);
  font-size: 0.75rem;
`;

const SectionTitle = styled.h3`
  color: var(--teal-200);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: var(--space-5) var(--space-4) var(--space-2);
  opacity: ${props => props.visible ? 0.8 : 0};
  transition: opacity var(--duration-lg) var(--ease-in-out);
  animation: ${fadeIn} 0.5s ease;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  flex: 1;
  gap: var(--space-1);
  overflow-y: auto;
  overflow-x: hidden;
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s var(--ease-out);
  flex-shrink: 0;
  transform: ${props => props.isActive ? 'scale(1.1)' : 'scale(1)'};
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  color: var(--text-on-dark);
  text-decoration: none;
  transition: all 0.3s var(--ease-out);
  white-space: nowrap;
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  opacity: 0.8;
  
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
    transition: transform 0.3s var(--ease-out);
    opacity: 0;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    opacity: 1;
    
    ${IconContainer} {
      transform: translateY(-2px) ${props => props.isActive ? 'scale(1.1)' : 'scale(1)'};
    }
  }
  
  &.active {
    background-color: rgba(6, 182, 212, 0.2);
    color: white;
    font-weight: 500;
    opacity: 1;
    
    &::before {
      transform: scaleY(1);
      opacity: 1;
    }
  }
  
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover ${IconContainer} {
      transform: none;
    }
  }
`;

const LinkText = styled.span`
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(-10px)'};
  transition: all 0.3s var(--ease-out);
  flex: 1;
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
