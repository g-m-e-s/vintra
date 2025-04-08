import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import PatientCard from '../components/patients/PatientCard';
import { useUI } from '../hooks/useUI';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const { showError, showSuccess } = useUI();
  const navigate = useNavigate();

  // Check for stored selected patient
  useEffect(() => {
    const storedPatient = localStorage.getItem('vintra_selected_patient');
    if (storedPatient) {
      try {
        setSelectedPatient(JSON.parse(storedPatient));
      } catch (e) {
        localStorage.removeItem('vintra_selected_patient');
      }
    }
  }, []);

  // Load patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real app
        // For demo purposes, we'll use mock data
        const mockPatients = [
          { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
          { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
          { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
          { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setPatients(mockPatients);
          setFilteredPatients(mockPatients);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching patients:', error);
        showError('Erro ao Carregar', 'Não foi possível carregar a lista de pacientes.');
        setLoading(false);
      }
    };

    // Mock appointments data
    const mockAppointments = [
      { id: 'app-1', time: '09:00', patientId: 'patient-1', patientName: 'Maria Silva', type: 'Consulta Regular' },
      { id: 'app-2', time: '10:30', patientId: 'patient-2', patientName: 'João Santos', type: 'Primeira Consulta' },
      { id: 'app-3', time: '14:00', patientId: 'patient-4', patientName: 'Carlos Pereira', type: 'Retorno' },
      { id: 'app-4', time: '16:30', patientId: 'patient-3', patientName: 'Ana Oliveira', type: 'Sessão de Terapia' }
    ];
    setAppointments(mockAppointments);

    fetchPatients();
  }, [showError]);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(normalizedSearch) || 
      patient.id.toLowerCase().includes(normalizedSearch)
    );
    
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Handler for patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('vintra_selected_patient', JSON.stringify(patient));
    showSuccess('Paciente Selecionado', `${patient.name} selecionado com sucesso. Todas as funcionalidades estão agora disponíveis.`);
    
    // Force refresh of sidebar by updating a localStorage timestamp
    localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
    
    // Navigate to patient detail in a real app
    // navigate(`/patients/${patient.id}`);
  };

  // Handler for clearing patient selection
  const handleClearPatientSelection = () => {
    setSelectedPatient(null);
    localStorage.removeItem('vintra_selected_patient');
    showSuccess('Seleção Removida', 'A seleção de paciente foi removida.');
    
    // Force refresh of sidebar by updating a localStorage timestamp
    localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Dashboard</DashboardTitle>
        <DashboardSubtitle>
          {selectedPatient 
            ? `Bem-vindo! Gerenciando ${selectedPatient.name}` 
            : 'Bem-vindo! Selecione um paciente no cabeçalho para iniciar'}
        </DashboardSubtitle>
      </DashboardHeader>
      
      {/* Layout de duas colunas */}
      <DashboardLayout>

        {/* Coluna da Agenda - À esquerda */}
        <AgendaColumn>
          <SectionHeader>
            <SectionTitle>Agenda de Hoje</SectionTitle>
            <StatusLabel>
              <i className="fas fa-calendar-check"></i> {new Date().toLocaleDateString('pt-BR')}
            </StatusLabel>
          </SectionHeader>
          
          <AgendaPreview>
            {appointments.length > 0 ? (
              <AppointmentsList>
                {appointments.map(appointment => (
                  <AppointmentItem 
                    key={appointment.id}
                    isActive={selectedPatient?.id === appointment.patientId}
                    onClick={() => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      if (patient) {
                        handlePatientSelect(patient);
                      }
                    }}
                  >
                    <AppointmentTime>{appointment.time}</AppointmentTime>
                    <AppointmentDetails>
                      <AppointmentPatient>{appointment.patientName}</AppointmentPatient>
                      <AppointmentType>{appointment.type}</AppointmentType>
                    </AppointmentDetails>
                    <AppointmentAction>
                      {selectedPatient?.id === appointment.patientId ? (
                        <i className="fas fa-check-circle"></i>
                      ) : (
                        <i className="fas fa-user-plus"></i>
                      )}
                    </AppointmentAction>
                  </AppointmentItem>
                ))}
              </AppointmentsList>
            ) : (
              <EmptyMessage>Não há compromissos agendados para hoje.</EmptyMessage>
            )}
          </AgendaPreview>
        </AgendaColumn>

        {/* Coluna de Informações - À direita */}
        <InfoColumn>
          {!selectedPatient ? (
            <InfoPanel>
              <SectionHeader>
                <SectionTitle>Selecione um Paciente</SectionTitle>
              </SectionHeader>
              
              <InstructionContainer>
                <i className="fas fa-arrow-up"></i>
                <InstructionText>
                  Selecione um paciente no cabeçalho acima para acessar suas informações e funcionalidades.
                </InstructionText>
              </InstructionContainer>
              
              <StatsPanels>
                <StatsCard>
                  <StatsIcon className="fas fa-users" />
                  <StatsValue>{patients.length}</StatsValue>
                  <StatsLabel>Pacientes Cadastrados</StatsLabel>
                </StatsCard>
                
                <StatsCard>
                  <StatsIcon className="fas fa-calendar-alt" />
                  <StatsValue>{appointments.length}</StatsValue>
                  <StatsLabel>Consultas Hoje</StatsLabel>
                </StatsCard>
              </StatsPanels>
            </InfoPanel>
          ) : (
            <InfoPanel>
              <SectionHeader>
                <SectionTitle>Paciente Selecionado</SectionTitle>
                <StatusLabel>
                  <i className="fas fa-user-check"></i> Ativo
                </StatusLabel>
              </SectionHeader>
              
              <SelectedPatientInfo>
                <SelectedPatientHeader>
                  <LargePatientAvatar>
                    {selectedPatient.name.charAt(0)}
                  </LargePatientAvatar>
                  
                  <SelectedPatientDetails>
                    <SelectedPatientName>{selectedPatient.name}</SelectedPatientName>
                    <SelectedPatientMeta>
                      <MetaItem>
                        <i className="fas fa-id-card"></i> ID: {selectedPatient.id}
                      </MetaItem>
                      <MetaItem>
                        <i className="fas fa-user"></i> {selectedPatient.age} anos, {selectedPatient.gender}
                      </MetaItem>
                      <MetaItem>
                        <i className="fas fa-clock"></i> Última visita: {selectedPatient.lastVisit}
                      </MetaItem>
                    </SelectedPatientMeta>
                  </SelectedPatientDetails>
                </SelectedPatientHeader>
                
                <PatientActionLinks>
                  <ActionLink to="/new-document">
                    <i className="fas fa-plus-circle"></i>
                    Novo Documento
                  </ActionLink>
                  <ActionLink to="/library">
                    <i className="fas fa-folder-open"></i>
                    Ver Repositório
                  </ActionLink>
                  <ActionButton onClick={handleClearPatientSelection}>
                    <i className="fas fa-exchange-alt"></i>
                    Trocar Paciente
                  </ActionButton>
                </PatientActionLinks>
              </SelectedPatientInfo>
            </InfoPanel>
          )}
        </InfoColumn>
      </DashboardLayout>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: var(--space-6);
  
  @media (max-width: 768px) {
    padding: var(--space-3);
  }
`;

const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AgendaColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const DashboardHeader = styled.div`
  margin-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const DashboardTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const DashboardSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: var(--space-2);
`;

const SectionHeader = styled.div`
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-family: var(--font-heading);
`;

const StatusLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const AgendaPreview = styled.section`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-8);
  transition: all var(--duration-md) cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-3);
  background-color: ${props => props.isActive ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.5)'};
  border-radius: var(--radius-lg);
  transition: all var(--duration-md) var(--ease-gentle);
  cursor: pointer;
  border: 1px solid ${props => props.isActive ? 'var(--accent-light)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.7)'};
    transform: translateX(3px);
  }
`;

const AppointmentTime = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  width: 60px;
  flex-shrink: 0;
`;

const AppointmentDetails = styled.div`
  flex: 1;
  margin-left: var(--space-4);
  min-width: 0;
`;

const AppointmentPatient = styled.div`
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AppointmentType = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const AppointmentAction = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: var(--text-secondary);
  transition: all var(--duration-md) var(--ease-gentle);
  flex-shrink: 0;
  
  ${AppointmentItem}:hover & {
    background-color: ${props => props.isActive ? 'var(--teal-700)' : 'var(--gray-300)'};
    color: white;
  }
`;

const InfoPanel = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
  height: 100%;
  
  display: flex;
  flex-direction: column;
`;

const InstructionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    margin-bottom: var(--space-3);
    color: var(--teal-400);
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const InstructionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
`;

const StatsPanels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-top: var(--space-4);
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-xs);
  transition: transform var(--duration-md) var(--ease-gentle);
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const StatsIcon = styled.i`
  font-size: 1.5rem;
  color: var(--teal-500);
  margin-bottom: var(--space-2);
`;

const StatsValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
`;

const StatsLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const SelectedPatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const SelectedPatientHeader = styled.div`
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-2);
`;

const LargePatientAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background-color: var(--teal-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
`;

const SelectedPatientDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SelectedPatientName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
`;

const SelectedPatientMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  color: var(--text-secondary);
  
  i {
    width: 16px;
    color: var(--teal-600);
  }
`;

const PatientActionLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background-color: var(--teal-50);
  color: var(--teal-700);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--duration-md) var(--ease-gentle);
  border: 1px solid var(--teal-100);
  
  &:hover {
    background-color: var(--teal-100);
    transform: translateY(-2px);
  }
  
  i {
    font-size: 1rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background-color: var(--gray-50);
  color: var(--gray-700);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--duration-md) var(--ease-gentle);
  border: 1px solid var(--gray-200);
  cursor: pointer;
  grid-column: span 2;
  
  &:hover {
    background-color: var(--gray-200);
  }
  
  i {
    font-size: 1rem;
  }
  
  @media (max-width: 1200px) {
    grid-column: span 1;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: var(--space-6);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-md) var(--ease-gentle);
  border: 1px solid var(--border-color);
  max-width: 500px;
  
  &:focus-within {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-md);
    border-color: var(--teal-300);
  }
`;

const SearchIcon = styled.i`
  color: var(--text-tertiary);
  margin-right: var(--space-2);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: var(--text-primary);
  padding: var(--space-2) 0;
  
  &:focus {
    outline: none;
  }
`;

const LoadingMessage = styled.p`
  color: var(--text-secondary);
  font-style: italic;
  padding: var(--space-4);
  text-align: center;
  grid-column: 1 / -1;
`;

const EmptyMessage = styled.p`
  color: var(--text-secondary);
  padding: var(--space-4);
  text-align: center;
  grid-column: 1 / -1;
`;



export default Dashboard;
