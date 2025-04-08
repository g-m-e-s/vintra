import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import Button from './Button';

const Header = ({ onMenuClick }) => {
  const isMobile = window.innerWidth < 768;
  const { currentUser, logout } = useAuth();
  const { showSuccess, openModal } = useUI();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Abrir página de seleção de paciente
  const openPatientSelector = () => {
    navigate('/patients');
  };

  useEffect(() => {
    // Check for selected patient
    const storedPatient = localStorage.getItem('vintra_selected_patient');
    if (storedPatient) {
      try {
        setSelectedPatient(JSON.parse(storedPatient));
      } catch (e) {
        localStorage.removeItem('vintra_selected_patient');
      }
    }

    // Listen for patient selection changes
    const handleStorageChange = () => {
      const updatedPatient = localStorage.getItem('vintra_selected_patient');
      if (updatedPatient) {
        try {
          setSelectedPatient(JSON.parse(updatedPatient));
        } catch (e) {
          setSelectedPatient(null);
        }
      } else {
        setSelectedPatient(null);
      }
    };

    // Check for changes in sidebar refresh indicator
    const refreshInterval = setInterval(() => {
      const lastRefresh = localStorage.getItem('vintra_sidebar_refresh');
      if (lastRefresh) {
        handleStorageChange();
      }
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    showSuccess('Logout', 'Você saiu da sua conta.');
    navigate('/login');
  };

  const showDimensionalModal = () => {
    if (!selectedPatient) {
      showSuccess('Paciente Necessário', 'Selecione um paciente para acessar o espaço multidimensional.');
      return;
    }
    
    openModal('dimensional', { patientData: null }); // In a real app, would pass patient data
  };

  return (
    <HeaderContainer>
      {/* Botão de menu visível apenas em mobile */}
      <MobileMenuButton onClick={onMenuClick}>
        <i className="fas fa-bars"></i>
      </MobileMenuButton>
      
      <LogoContainer>
        <LogoImage src="/logo.png" alt="VINTRA Logo" />
        <AppTitle>VINTRA</AppTitle>
      </LogoContainer>
      
      <Nav>
        {/* Seletor de Paciente Melhorado */}
        <PatientSelectorContainer>
          {selectedPatient ? (
            <SelectedPatientDisplay>
              <PatientAvatar>{selectedPatient.name.charAt(0)}</PatientAvatar>
              <PatientInfo>
                <PatientName>{selectedPatient.name}</PatientName>
                <PatientMeta>ID: {selectedPatient.id.replace('patient-', '')}</PatientMeta>
              </PatientInfo>
              <PatientActionButton onClick={() => {
                localStorage.removeItem('vintra_selected_patient');
                setSelectedPatient(null);
                localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
              }}>
                <i className="fas fa-exchange-alt"></i>
                <span>Trocar</span>
              </PatientActionButton>
            </SelectedPatientDisplay>
          ) : (
            <NoPatientWarning onClick={openPatientSelector}>
              <i className="fas fa-user-plus"></i>
              <span>Selecione um paciente</span>
              <PatientActionButton>
                <i className="fas fa-chevron-right"></i>
              </PatientActionButton>
            </NoPatientWarning>
          )}
        </PatientSelectorContainer>
        
        <DimensionalButton 
          onClick={showDimensionalModal}
          variant="secondary"
          disabled={!selectedPatient}
          title={!selectedPatient ? "Selecione um paciente primeiro" : "Ativar espaço multidimensional"}
        >
          <i className="fas fa-brain btn-icon"></i> 
          {!isMobile && "Ativar Espaço Multidimensional"}
        </DimensionalButton>
      </Nav>
      
      <UserMenu>
        <UserAvatar onClick={toggleUserMenu}>
          {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
        </UserAvatar>
        
        {userMenuOpen && (
          <UserDropdown>
            <UserDropdownItem href="#perfil">
              <i className="fas fa-user"></i> Meu Perfil
            </UserDropdownItem>
            <UserDropdownItem href="#preferencias">
              <i className="fas fa-cog"></i> Preferências
            </UserDropdownItem>
            <UserDropdownDivider />
            <UserDropdownItem as="button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Sair
            </UserDropdownItem>
          </UserDropdown>
        )}
      </UserMenu>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.9); /* Aumentado para maior opacidade */
  backdrop-filter: blur(var(--blur-md));
  position: sticky;
  top: 0;
  z-index: 10;
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background var(--duration-lg) var(--ease-gentle);
  border-bottom: 1px solid var(--border-color-light);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(6, 182, 212, 0.2) 20%,
      rgba(6, 182, 212, 0.5) 50%,
      rgba(6, 182, 212, 0.2) 80%,
      transparent 100%);
    opacity: 0.5;
    clip-path: polygon(
      0% 0%, 5% 20%, 15% 10%, 25% 30%, 35% 0%, 45% 20%, 55% 5%, 65% 25%, 75% 10%, 85% 30%, 95% 5%, 100% 20%, 100% 100%, 0% 100%
    );
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--space-2);
  
  /* Sempre visível em mobile, nunca em desktop */
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-right: auto;
`;

const LogoImage = styled.img`
  height: 28px;
  width: auto;
  transition: transform var(--duration-md) var(--ease-out);
  
  ${LogoContainer}:hover & {
    transform: scale(1.05);
  }
`;

const AppTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  font-family: var(--font-heading);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-5);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const PatientSelectorContainer = styled.div`
  flex: 1;
  max-width: 500px;
`;

const SelectedPatientDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
  border-radius: var(--radius-lg);
  border: 1px solid var(--teal-300);
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.15);
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5));
  }
`;

const PatientAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--accent-vivid);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--text-on-dark);
  flex-shrink: 0;
`;

const PatientInfo = styled.div`
  min-width: 0;
`;

const PatientName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PatientMeta = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const NoPatientWarning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--warning-vivid);
  font-size: 0.875rem;
  background: var(--warning-subtle);
  border-radius: var(--radius-lg);
  border: 1px solid var(--warning-light);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: var(--warning-subtle-hover, #fff8e5);
    border-color: var(--warning-vivid);
  }
`;

const PatientActionButton = styled.button`
  background: rgba(6, 182, 212, 0.1);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-1) var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 0.75rem;
  color: var(--teal-700);
  cursor: pointer;
  margin-left: auto;
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: rgba(6, 182, 212, 0.2);
  }
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const DimensionalButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  
  i {
    font-size: 0.875em;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-lg);
  transition: all var(--duration-md) var(--ease-gentle);
  margin-left: var(--space-4);
  
  &:hover {
    background: var(--gray-100);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--teal-900);
  color: var(--text-on-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  transition: transform var(--duration-md) var(--ease-out);
  cursor: pointer;
  
  ${UserMenu}:hover & {
    transform: scale(1.05);
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + var(--space-3));
  right: 0;
  background-color: var(--surface-overlay);
  backdrop-filter: blur(var(--blur-md));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  transform-origin: top right;
  animation: dropdownAppear var(--duration-md) var(--ease-out) forwards;
  padding: var(--space-2) 0;
  
  @keyframes dropdownAppear {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const UserDropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all var(--duration-md) var(--ease-gentle);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  
  i {
    width: 16px;
    text-align: center;
    color: var(--text-secondary);
  }
  
  &:hover {
    background-color: var(--gray-100);
    
    i {
      color: var(--accent);
    }
  }
`;

const UserDropdownDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--gray-300),
    transparent
  );
  margin: var(--space-1) 0;
  opacity: 0.6;
`;

export default Header;
