// src/pages/NewDocument.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';

const NewDocument = () => {
  const [activeTab, setActiveTab] = useState('record');

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <HeaderIcon>
            <i className="fas fa-plus"></i>
          </HeaderIcon>
          <div>
            <Title>Novo Documento</Title>
            <Subtitle>Selecione uma opção para criar um documento</Subtitle>
          </div>
        </HeaderTitle>
      </Header>
      
      <TabsContainer>
        <TabButton 
          active={activeTab === 'record'} 
          onClick={() => setActiveTab('record')}
        >
          Gravar
        </TabButton>
        <TabButton 
          active={activeTab === 'upload'} 
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </TabButton>
        <TabButton 
          active={activeTab === 'transcribe'} 
          onClick={() => setActiveTab('transcribe')}
        >
          Transcrição
        </TabButton>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'record' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Gravação de Áudio</ModuleTitle>
              <ModuleSubtitle>Grave uma sessão para transcrição automática</ModuleSubtitle>
            </ModuleHeader>
            
            <RecordingControls>
              <RecordButton>
                <i className="fas fa-microphone"></i>
              </RecordButton>
            </RecordingControls>
            
            <RecordingInfo>
              <RecordingTime>00:00:00</RecordingTime>
              <RecordingStatus>Pronto para gravar</RecordingStatus>
            </RecordingInfo>
            
            <Visualizer>
              <p>Visualizador de áudio será exibido aqui</p>
            </Visualizer>
            
            <OptionCheckbox>
              <input type="checkbox" id="diarization" checked />
              <label htmlFor="diarization">Habilitar Diarização</label>
            </OptionCheckbox>
          </Module>
        )}
        
        {activeTab === 'upload' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Upload de Arquivo</ModuleTitle>
              <ModuleSubtitle>Carregue um arquivo de áudio ou texto</ModuleSubtitle>
            </ModuleHeader>
            
            <UploadArea>
              <UploadIcon>
                <i className="fas fa-cloud-upload-alt"></i>
              </UploadIcon>
              <p>Arraste ou clique para selecionar</p>
              <UploadHint>Suporta áudio (MP3, WAV, M4A) e texto (TXT)</UploadHint>
            </UploadArea>
            
            <OptionCheckbox>
              <input type="checkbox" id="uploadDiarization" checked />
              <label htmlFor="uploadDiarization">Habilitar Diarização para áudios</label>
            </OptionCheckbox>
          </Module>
        )}
        
        {activeTab === 'transcribe' && (
          <Module>
            <ModuleHeader>
              <ModuleTitle>Transcrição Manual</ModuleTitle>
              <ModuleSubtitle>Digite ou cole a transcrição</ModuleSubtitle>
            </ModuleHeader>
            
            <TextareaContainer>
              <Textarea 
                placeholder="Digite ou cole o texto aqui..." 
                rows={10}
              />
            </TextareaContainer>
            
            <ButtonContainer>
              <Button variant="primary">
                <i className="fas fa-save"></i> Salvar Transcrição
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-out);
  border: none;
  font-size: 1.5rem;
  background-color: var(--error);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: scale(1.05);
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
  height: 60px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-style: italic;
`;

const OptionCheckbox = styled.div`
  margin-top: var(--space-4);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
  
  input {
    width: 16px;
    height: 16px;
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

export default NewDocument;
