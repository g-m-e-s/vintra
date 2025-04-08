// src/pages/NewConsultation.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../hooks/useUI';

const NewConsultation = () => {
  const [activeTab, setActiveTab] = useState('record');
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00:00');
  const navigate = useNavigate();
  const { showSuccess } = useUI();

  // Simula iniciar/parar a gravação
  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      // Simulação de tempo decorrido (em uma app real, isso seria um timer real)
      setRecordingTime('00:00:01');
      setTimeout(() => {
        if (recording) setRecordingTime('00:01:23');
      }, 1000);
    } else {
      setRecording(false);
      // Simula a finalização da gravação e navegação para documentação
      setTimeout(() => {
        showSuccess('Gravação Concluída', 'Áudio processado com sucesso.');
        navigate('/documentation');
      }, 1500);
    }
  };

  // Simula o upload de arquivo
  const handleUpload = () => {
    showSuccess('Upload Concluído', 'Arquivo processado com sucesso.');
    setTimeout(() => {
      navigate('/documentation');
    }, 1000);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <HeaderIcon>
            <i className="fas fa-stethoscope"></i>
          </HeaderIcon>
          <div>
            <Title>Nova Consulta</Title>
            <Subtitle>Registre os dados da consulta para processamento</Subtitle>
          </div>
        </HeaderTitle>
      </Header>
      
      <TabsContainer>
        <TabButton 
          active={activeTab === 'record'} 
          onClick={() => setActiveTab('record')}
        >
          Gravar Consulta
        </TabButton>
        <TabButton 
          active={activeTab === 'upload'} 
          onClick={() => setActiveTab('upload')}
        >
          Upload de Áudio
        </TabButton>
        <TabButton 
          active={activeTab === 'manual'} 
          onClick={() => setActiveTab('manual')}
        >
          Entrada Manual
        </TabButton>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'record' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Gravação da Consulta</ModuleTitle>
              <ModuleSubtitle>Grave a consulta para transcrição e processamento automático</ModuleSubtitle>
            </ModuleHeader>
            
            <RecordingControls>
              <RecordButton recording={recording} onClick={toggleRecording}>
                <i className={`fas ${recording ? 'fa-stop' : 'fa-microphone'}`}></i>
              </RecordButton>
            </RecordingControls>
            
            <RecordingInfo>
              <RecordingTime>{recordingTime}</RecordingTime>
              <RecordingStatus>
                {recording ? 'Gravando...' : 'Pronto para gravar'}
              </RecordingStatus>
            </RecordingInfo>
            
            <Visualizer recording={recording}>
              {recording ? (
                <WaveformAnimated>
                  {Array(20).fill().map((_, i) => (
                    <WaveBar key={i} />
                  ))}
                </WaveformAnimated>
              ) : (
                <p>Visualizador de áudio será exibido durante a gravação</p>
              )}
            </Visualizer>
            
            <OptionCheckbox>
              <input type="checkbox" id="diarization" defaultChecked />
              <label htmlFor="diarization">Habilitar Diarização (separa as vozes do médico e paciente)</label>
            </OptionCheckbox>
            
            <OptionCheckbox>
              <input type="checkbox" id="autoDocs" defaultChecked />
              <label htmlFor="autoDocs">Gerar documentação automaticamente após gravação</label>
            </OptionCheckbox>
          </Module>
        )}
        
        {activeTab === 'upload' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Upload de Áudio da Consulta</ModuleTitle>
              <ModuleSubtitle>Carregue um arquivo de áudio de uma consulta prévia</ModuleSubtitle>
            </ModuleHeader>
            
            <UploadArea onClick={handleUpload}>
              <UploadIcon>
                <i className="fas fa-cloud-upload-alt"></i>
              </UploadIcon>
              <p>Arraste o arquivo ou clique para selecionar</p>
              <UploadHint>Suporta áudio (MP3, WAV, M4A)</UploadHint>
            </UploadArea>
            
            <OptionCheckbox>
              <input type="checkbox" id="uploadDiarization" defaultChecked />
              <label htmlFor="uploadDiarization">Habilitar Diarização (separa as vozes do médico e paciente)</label>
            </OptionCheckbox>
            
            <OptionCheckbox>
              <input type="checkbox" id="uploadAutoDocs" defaultChecked />
              <label htmlFor="uploadAutoDocs">Gerar documentação automaticamente após processamento</label>
            </OptionCheckbox>
          </Module>
        )}
        
        {activeTab === 'manual' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Entrada Manual de Consulta</ModuleTitle>
              <ModuleSubtitle>Digite ou cole o texto da consulta</ModuleSubtitle>
            </ModuleHeader>
            
            <TextareaContainer>
              <Textarea 
                placeholder="Digite ou cole o texto da consulta aqui... 
                
Exemplo:
Dr: Como está se sentindo hoje?
Paciente: Tenho sentido dores na região lombar há cerca de duas semanas.
Dr: Essa dor irradia para outras partes do corpo?
..." 
                rows={12}
              />
            </TextareaContainer>
            
            <ButtonContainer>
              <Button variant="primary" onClick={() => {
                showSuccess('Texto Processado', 'Consulta registrada com sucesso.');
                setTimeout(() => navigate('/documentation'), 1000);
              }}>
                <i className="fas fa-file-medical"></i> Processar Consulta
              </Button>
            </ButtonContainer>
          </Module>
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
  background: var(--gray-50);
  border-bottom: 1px solid var(--border-color);
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const HeaderIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background-color: var(--teal-100);
  color: var(--teal-700);
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-1);
  font-family: var(--font-heading);
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

const TabsContainer = styled.div`
  display: flex;
  padding: var(--space-4) var(--space-6);
  gap: var(--space-2);
  border-bottom: 1px solid var(--border-color);
`;

const TabButton = styled.button`
  padding: var(--space-2) var(--space-4);
  background: ${props => props.active ? 'var(--teal-500)' : 'var(--gray-100)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-500)' : 'var(--gray-200)'};
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
`;

const Module = styled.div`
  padding: var(--space-8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  max-width: 700px;
  margin: 0 auto;
  
  &:hover {
    box-shadow: var(--shadow-xl);
  }
`;

const ModuleHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-6);
`;

const ModuleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-family: var(--font-heading);
`;

const ModuleSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--text-secondary);
`;

const RecordingControls = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const RecordButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-out);
  border: none;
  font-size: 1.5rem;
  background-color: ${props => props.recording ? 'var(--error-vivid)' : 'var(--error)'};
  color: white;
  box-shadow: ${props => props.recording ? 'var(--shadow-lg), 0 0 20px rgba(239, 68, 68, 0.5)' : 'var(--shadow-md)'};
  transform: ${props => props.recording ? 'scale(1.1)' : 'scale(1)'};
  
  &:hover {
    transform: ${props => props.recording ? 'scale(1.15)' : 'scale(1.05)'};
    box-shadow: var(--shadow-lg);
    background-color: var(--error-vivid);
  }
`;

const RecordingInfo = styled.div`
  text-align: center;
  margin-bottom: var(--space-6);
`;

const RecordingTime = styled.div`
  font-size: 2.5rem;
  font-weight: 300;
  font-family: monospace;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
  letter-spacing: 0.05em;
`;

const RecordingStatus = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const Visualizer = styled.div`
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-style: italic;
  overflow: hidden;
  padding: 0 var(--space-4);
  border: 1px solid ${props => props.recording ? 'var(--teal-200)' : 'transparent'};
`;

const WaveformAnimated = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const WaveBar = styled.div`
  width: 3px;
  background-color: var(--teal-400);
  border-radius: var(--radius-full);
  height: 30%;
  animation: waveform 1s ease-in-out infinite;
  animation-delay: ${() => Math.random() * 1}s;
  
  @keyframes waveform {
    0% { height: 30%; }
    50% { height: 70%; }
    100% { height: 30%; }
  }
`;

const OptionCheckbox = styled.div`
  margin-top: var(--space-4);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--teal-600);
  }
  
  label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
`;

const UploadArea = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-xl);
  padding: var(--space-10) var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-out);
  margin-bottom: var(--space-6);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
  
  &:hover {
    border-color: var(--teal-400);
    background-color: var(--teal-50);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  p {
    font-weight: 500;
    margin: var(--space-4) 0 var(--space-2);
    color: var(--text-primary);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: var(--teal-400);
`;

const UploadHint = styled.div`
  font-size: 0.8125rem;
  color: var(--text-tertiary);
`;

const TextareaContainer = styled.div`
  margin-bottom: var(--space-6);
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: var(--space-4);
  background-color: var(--surface-white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  color: var(--text-primary);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--teal-300);
    box-shadow: 0 0 0 2px var(--accent-light);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default NewConsultation;
