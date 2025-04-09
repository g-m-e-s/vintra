import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import Button from './Button';

const Header = ({ onMenuClick, isMobile }) => {
  const { currentUser, logout } = useAuth();
  const { showSuccess, openModal, showError } = useUI();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [agendaItems, setAgendaItems] = useState([]);
  const [patientAgendaVisible, setPatientAgendaVisible] = useState(false);

  // Carregar itens simulados da agenda
  useEffect(() => {
    // Mock appointments data
    const mockAppointments = [
      { id: 'app-1', time: '09:00', patientId: 'patient-1', patientName: 'Maria Silva', type: 'Consulta Regular' },
      { id: 'app-2', time: '10:30', patientId: 'patient-2', patientName: 'João Santos', type: 'Primeira Consulta' },
      { id: 'app-3', time: '14:00', patientId: 'patient-4', patientName: 'Carlos Pereira', type: 'Retorno' },
      { id: 'app-4', time: '16:30', patientId: 'patient-3', patientName: 'Ana Oliveira', type: 'Sessão de Terapia' }
    ];
    setAgendaItems(mockAppointments);
  }, []);

  // Verificar paciente selecionado
  useEffect(() => {
    // Check for selected patient
    const storedPatient = localStorage.getItem('vintra_selected_patient');
    if (storedPatient) {
      try {
        setSelectedPatient(JSON.parse(storedPatient));
        setPatientAgendaVisible(true); // Mostrar agenda quando paciente selecionado
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
          setPatientAgendaVisible(true); // Mostrar agenda quando paciente selecionado
        } catch (e) {
          setSelectedPatient(null);
          setPatientAgendaVisible(false);
        }
      } else {
        setSelectedPatient(null);
        setPatientAgendaVisible(false);
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

  // Abrir página de seleção de paciente
  const openPatientSelector = () => {
    console.log('Navigating to patients page...');
    navigate('/patients');
  };

  // Toggles
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    showSuccess('Logout', 'Você saiu da sua conta.');
    navigate('/login');
  };

  // Seleciona um paciente da agenda
  const selectPatientFromAgenda = (appointment) => {
    const patient = {
      id: appointment.patientId,
      name: appointment.patientName
    };
    setSelectedPatient(patient);
    localStorage.setItem('vintra_selected_patient', JSON.stringify(patient));
    showSuccess('Patient Selected', `${patient.name} selected from schedule.`);
    localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
  };

  // Ativar espaço multidimensional
  const showDimensionalModal = () => {
    if (!selectedPatient) {
      showError('Patient Required', 'Select a patient to access the multidimensional space.');
      return;
    }
    
    openModal('dimensional', { patientData: selectedPatient });
  };

  // Filtrar agenda para o paciente selecionado
  const getPatientAppointments = () => {
    if (!selectedPatient) return [];
    return agendaItems.filter(app => app.patientId === selectedPatient.id);
  };

  // Verificar se há consultas para o paciente selecionado
  const patientAppointments = getPatientAppointments();
  const hasPatientAppointments = patientAppointments.length > 0;

  // Trocar paciente
  const handleClearPatient = () => {
    localStorage.removeItem('vintra_selected_patient');
    setSelectedPatient(null);
    setPatientAgendaVisible(false);
    localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
    showSuccess('Selection Removed', 'Patient selection has been removed.');
  };

  return (
    <HeaderWrapper>
      {/* Header principal */}
      <HeaderContainer expanded={!isMobile}>
        {/* Botão de menu (hamburger) */}
        <MobileMenuButton onClick={onMenuClick} data-testid="mobile-menu-button">
          <i className="fas fa-bars"></i>
        </MobileMenuButton>
        
        <LogoContainer onClick={() => {
          console.log('Navigating to home...'); 
          navigate('/');
        }}>
          <LogoImage src="/logo.png" alt="VINTRA Logo" />
          <AppTitle>VINTRA</AppTitle>
        </LogoContainer>
        
        {/* Conteúdo central - Adapta baseado na seleção de paciente */}
        <HeaderContent>
          {selectedPatient ? (
            <SelectedPatientSection>
              <SelectedPatientDisplay>
                <PatientAvatar>{selectedPatient.name.charAt(0)}</PatientAvatar>
                <PatientInfo>
                  <PatientName>{selectedPatient.name}</PatientName>
                  <PatientActions>
                    <NewConsultButton onClick={(e) => {
                      e.preventDefault();
                      console.log('Navigating to new consultation...');
                      navigate('/new-consultation');
                    }}>
                      <i className="fas fa-plus-circle"></i>
                      {!isMobile && <span>New Consult</span>}
                    </NewConsultButton>
                    
                    <PatientActionButton onClick={(e) => {
                      e.preventDefault();
                      console.log('Handling clear patient...');
                      handleClearPatient();
                    }}>
                      <i className="fas fa-exchange-alt"></i>
                      {!isMobile && <span>Change</span>}
                    </PatientActionButton>
                  </PatientActions>
                </PatientInfo>
              </SelectedPatientDisplay>
            </SelectedPatientSection>
          ) : (
            <NoPatientWarning onClick={(e) => {
              e.preventDefault();
              console.log('Opening patient selector...');
              openPatientSelector();
            }}>
              <i className="fas fa-user-plus"></i>
              <span>Select a patient</span>
              <PatientActionButton>
                <i className="fas fa-chevron-right"></i>
              </PatientActionButton>
            </NoPatientWarning>
          )}
        </HeaderContent>
        
        {/* Ações específicas - visíveis apenas quando paciente selecionado */}
        {selectedPatient && (
          <ActionsSection>
            {/* Botão do espaço multidimensional */}
            <DimensionalButton 
              onClick={(e) => {
                e.preventDefault();
                console.log('Opening dimensional space...');
                showDimensionalModal();
              }}
              variant="secondary"
              title="Ativar espaço multidimensional"
              data-testid="dimensional-button"
            >
              <i className="fas fa-brain"></i> 
              {!isMobile && <span>Dimensions</span>}
            </DimensionalButton>
            
            {/* Botão de documentos */}
            <ActionButton
              onClick={(e) => {
                e.preventDefault();
                console.log('Navigating to documentation...');
                navigate('/documentation');
              }}
              title="Documentação clínica"
              data-testid="docs-button"
            >
              <i className="fas fa-file-alt"></i>
              {!isMobile && <span>Docs</span>}
            </ActionButton>
            
            {/* Botão de repositório */}
            <ActionButton
              onClick={(e) => {
                e.preventDefault();
                console.log('Navigating to library...');
                navigate('/library');
              }}
              title="Repositório de documentos"
              data-testid="repo-button"
            >
              <i className="fas fa-folder-open"></i>
              {!isMobile && <span>Repo</span>}
            </ActionButton>
          </ActionsSection>
        )}
        
        {/* Menu do Usuário */}
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
      
      {/* Agenda integrada ao header quando um paciente está selecionado */}
      {selectedPatient && (
        <PatientAgendaBar>
          <AgendaLabel>
            <i className="fas fa-calendar-alt"></i>
            <span>{isMobile ? "Schedule" : `${selectedPatient.name}'s Schedule`}</span>
          </AgendaLabel>
          
          {hasPatientAppointments ? (
            <AgendaItems>
              {patientAppointments.map(app => (
                <AgendaAppointment key={app.id}>
                  <AppointmentTime>{app.time}</AppointmentTime>
                  <AppointmentType>{!isMobile && app.type}</AppointmentType>
                </AgendaAppointment>
              ))}
            </AgendaItems>
          ) : (
            <NoAppointmentsMessage>
              {isMobile ? "No schedule" : "No appointments scheduled"}
            </NoAppointmentsMessage>
          )}
          
          <AddAppointmentButton>
            <i className="fas fa-plus"></i>
            {!isMobile && <span>Schedule</span>}
          </AddAppointmentButton>
        </PatientAgendaBar>
      )}
    </HeaderWrapper>
  );
};

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 40;
  background: transparent;
  box-shadow: var(--shadow-md);
`;

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(var(--blur-md));
  padding: var(--space-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border-color-light);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  height: ${props => props.expanded ? '70px' : '60px'};
  gap: var(--space-2);
  position: relative;
  
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
  
  @media (max-width: 768px) {
    padding: var(--space-2);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 768px) {
    gap: var(--space-2);
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: var(--gray-100);
  }
  
  /* Sempre visível */
  display: block;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 10;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    display: none; /* Oculta em mobile para economizar espaço */
  }
`;

const LogoImage = styled.img`
  height: 28px;
  width: auto;
`;

const AppTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  font-family: var(--font-heading);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Seção de paciente selecionado
const SelectedPatientSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  min-width: 0;
  flex: 1;
  animation: ${slideIn} 0.3s ease;
  
  @media (max-width: 768px) {
    gap: var(--space-2);
  }
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
  flex-shrink: 0;
  min-width: 0;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5));
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1) var(--space-2);
    gap: var(--space-2);
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
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: var(--space-2);
  }
`;

const PatientName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  
  @media (max-width: 768px) {
    max-width: 80px;
    font-size: 0.75rem;
  }
`;

const PatientActions = styled.div`
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-1);
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
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
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1) var(--space-2);
    font-size: 0.75rem;
    
    span {
      display: none;
    }
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
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: rgba(6, 182, 212, 0.2);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1);
  }
`;

// Ações na barra de navegação
const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
  
  @media (max-width: 768px) {
    gap: var(--space-1);
  }
`;

const NewConsultButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--teal-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-2);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: var(--teal-600);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1);
  }
`;

const DimensionalButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  padding: var(--space-1) var(--space-3);
  height: 32px;
  
  @media (max-width: 768px) {
    padding: var(--space-1);
    min-width: auto;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--gray-100);
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-1) var(--space-3);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  height: 32px;
  
  &:hover {
    background: var(--gray-200);
    transform: translateY(-1px);
    color: var(--text-primary);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1);
    min-width: auto;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
  padding: var(--space-1);
  border-radius: var(--radius-lg);
  transition: all var(--duration-md) var(--ease-gentle);
  margin-left: var(--space-2);
  
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
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  cursor: pointer;
  
  ${UserMenu}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
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
  animation: ${fadeIn} 0.3s ease forwards;
  padding: var(--space-2) 0;
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

// Barra de agenda do paciente
const PatientAgendaBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05));
  border-bottom: 1px solid var(--teal-200);
  animation: ${slideIn} 0.3s ease;
  position: relative;
  
  @media (max-width: 768px) {
    padding: var(--space-2);
    gap: var(--space-2);
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const AgendaToggleButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--teal-300);
  color: var(--teal-700);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.75rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
`;

const AgendaLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--teal-700);
  font-weight: 500;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const AgendaItems = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 var(--space-2);
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Melhoria de UX com snap scroll */
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0;
  }
`;

const AgendaAppointment = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--space-2) var(--space-3);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  border: 1px solid var(--teal-200);
  transition: all var(--duration-md) var(--ease-gentle);
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
`;

const AppointmentTime = styled.div`
  font-weight: 600;
  color: var(--teal-700);
  font-size: 0.875rem;
`;

const AppointmentType = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const NoAppointmentsMessage = styled.div`
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-style: italic;
  flex: 1;
`;

const AddAppointmentButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--teal-50);
  color: var(--teal-700);
  border: 1px solid var(--teal-200);
  border-radius: var(--radius-lg);
  padding: var(--space-1) var(--space-3);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  
  &:hover {
    background: var(--teal-100);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1) var(--space-2);
    font-size: 0.75rem;
    
    span {
      display: none;
    }
  }
`;

export default Header;
