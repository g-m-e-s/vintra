// src/pages/PatientDetail.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useUI } from '../hooks/useUI';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useUI();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // Mock data - em uma app real, isso viria da API
        const mockPatients = [
          { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
          { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
          { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
          { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
        ];
        
        const found = mockPatients.find(p => p.id === id);
        if (found) {
          setPatient(found);
        } else {
          showError('Paciente não encontrado', 'O paciente solicitado não existe na base de dados.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        showError('Erro', 'Não foi possível carregar os dados do paciente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, navigate, showError]);

  if (loading) return <Loading>Carregando dados do paciente...</Loading>;
  
  if (!patient) return null;

  return (
    <Container>
      <Header>
        <PatientInfo>
          <PatientName>{patient.name}</PatientName>
          <PatientDetails>{patient.age} anos • {patient.gender} • Prontuário #{id.replace('patient-', '')}</PatientDetails>
        </PatientInfo>
        <Actions>
          <Button variant="secondary" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Voltar
          </Button>
        </Actions>
      </Header>
      
      <Tabs>
        <Tab 
          active={activeTab === 'summary'} 
          onClick={() => setActiveTab('summary')}
        >
          <i className="fas fa-chart-line"></i> Resumo
        </Tab>
        <Tab 
          active={activeTab === 'consultation'} 
          onClick={() => setActiveTab('consultation')}
        >
          <i className="fas fa-microphone"></i> Nova Consulta
        </Tab>
        <Tab 
          active={activeTab === 'documents'} 
          onClick={() => setActiveTab('documents')}
        >
          <i className="fas fa-file-medical-alt"></i> Documentação
        </Tab>
        <Tab 
          active={activeTab === 'processing'} 
          onClick={() => setActiveTab('processing')}
        >
          <i className="fas fa-cogs"></i> Processamento
        </Tab>
        <Tab 
          active={activeTab === 'repository'} 
          onClick={() => setActiveTab('repository')}
        >
          <i className="fas fa-folder"></i> Repositório
        </Tab>
      </Tabs>
      
      <TabContent>
        {activeTab === 'summary' && (
          <TabPanel>
            <h3>Análise Dimensional</h3>
            <p>Esta visualização será implementada em breve.</p>
          </TabPanel>
        )}
        
        {activeTab === 'consultation' && (
          <TabPanel>
            <h3>Nova Consulta</h3>
            <p>Use esta área para iniciar uma nova gravação ou importar áudio.</p>
            <Button variant="primary" onClick={() => navigate('/new-document')}>
              Criar Novo Documento
            </Button>
          </TabPanel>
        )}
        
        {activeTab === 'documents' && (
          <TabPanel>
            <h3>Documentação</h3>
            <p>A lista de documentos do paciente será exibida aqui.</p>
          </TabPanel>
        )}
        
        {activeTab === 'processing' && (
          <TabPanel>
            <h3>Processamento</h3>
            <p>Ferramentas de processamento de documentos serão exibidas aqui.</p>
          </TabPanel>
        )}
        
        {activeTab === 'repository' && (
          <TabPanel>
            <h3>Repositório</h3>
            <p>O repositório de documentos do paciente será exibido aqui.</p>
          </TabPanel>
        )}
      </TabContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: var(--space-4) var(--space-6);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(var(--blur-md));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color-light);
`;

const PatientInfo = styled.div`
  min-width: 0;
`;

const PatientName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-heading);
`;

const PatientDetails = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color-light);
  background-color: rgba(255, 255, 255, 0.5);
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9375rem;
  color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-secondary)'};
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  border-bottom: 2px solid ${props => props.active ? 'var(--teal-500)' : 'transparent'};
  white-space: nowrap;
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-primary)'};
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  i {
    font-size: 1em;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: var(--surface-background);
`;

const TabPanel = styled.div`
  padding: var(--space-6);
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--text-primary);
    font-family: var(--font-heading);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
  font-style: italic;
`;

export default PatientDetail;