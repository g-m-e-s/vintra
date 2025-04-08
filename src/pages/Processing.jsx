import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { vintraApi } from '../services/api';
import { useUI } from '../hooks/useUI';

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useUI();
  const consultationId = location.state?.consultationId;

  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [selectedFormats, setSelectedFormats] = useState({
    vintra: true,
    soap: true,
    ipissima: true,
    narrative: true,
    orientacoes: true
  });

  useEffect(() => {
    if (!consultationId) {
      showError('Erro', 'ID da consulta não fornecido');
      navigate('/new-consultation');
      return;
    }

    const checkStatus = async () => {
      try {
        const result = await vintraApi.getConsultationResult(consultationId);
        
        if (result.status === 'completed') {
          navigate('/results', { state: { consultationId } });
        } else if (result.status === 'failed') {
          showError('Erro', 'Falha no processamento da consulta');
          navigate('/new-consultation');
        } else {
          setStatus(result.status);
          setProgress(result.progress || 0);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    // Checar status a cada 2 segundos
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [consultationId, navigate, showError]);

  const toggleFormat = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const getStatusText = () => {
    switch (status) {
      case 'initializing':
        return 'Inicializando processamento...';
      case 'audio_processing':
        return 'Processando áudio...';
      case 'transcribing':
        return 'Transcrevendo áudio...';
      case 'diarizing':
        return 'Separando vozes...';
      case 'analyzing':
        return 'Analisando conteúdo...';
      case 'generating_documents':
        return 'Gerando documentos...';
      default:
        return 'Processando...';
    }
  };

  return (
    <DocumentWorkspace>
      <DocumentToolbar>
        <DocumentInfoHeader>
          <DocumentInfoIcon>
            <i className="fas fa-cogs"></i>
          </DocumentInfoIcon>
          <DocumentInfoDetails>
            <h2>Processamento</h2>
            <DocumentInfoMeta>
              {getStatusText()}
            </DocumentInfoMeta>
          </DocumentInfoDetails>
        </DocumentInfoHeader>
      </DocumentToolbar>
      
      <DocumentContent>
        <ProcessingModule>
          <ProcessingHeader>
            <ProcessingTitle>Processamento em Andamento</ProcessingTitle>
            <ProcessingSubtitle>Selecione os formatos a gerar</ProcessingSubtitle>
          </ProcessingHeader>
          
          <FormatOptions>
            <FormatOption 
              active={selectedFormats.vintra}
              onClick={() => toggleFormat('vintra')}
            >
              VINTRA
            </FormatOption>
            <FormatOption 
              active={selectedFormats.soap}
              onClick={() => toggleFormat('soap')}
            >
              SOAP
            </FormatOption>
            <FormatOption 
              active={selectedFormats.ipissima}
              onClick={() => toggleFormat('ipissima')}
            >
              Ipíssima
            </FormatOption>
            <FormatOption 
              active={selectedFormats.narrative}
              onClick={() => toggleFormat('narrative')}
            >
              Narrativa
            </FormatOption>
            <FormatOption 
              active={selectedFormats.orientacoes}
              onClick={() => toggleFormat('orientacoes')}
            >
              Orientações
            </FormatOption>
          </FormatOptions>
          
          <ProgressContainer>
            <ProgressBar progress={progress} />
            <ProgressText>{Math.round(progress)}%</ProgressText>
          </ProgressContainer>
          
          <ProcessingStatus>
            <StatusIcon>
              <i className="fas fa-circle-notch fa-spin"></i>
            </StatusIcon>
            <StatusText>{getStatusText()}</StatusText>
          </ProcessingStatus>
        </ProcessingModule>
      </DocumentContent>
    </DocumentWorkspace>
  );
};

const DocumentWorkspace = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DocumentToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-5);
  background: var(--gray-50);
  backdrop-filter: blur(var(--blur-sm));
  transition: all var(--duration-md) var(--ease-gentle);
  position: relative;
  z-index: 2;
`;

const DocumentInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const DocumentInfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--teal-100);
  color: var(--teal-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const DocumentInfoDetails = styled.div`
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-1);
    font-family: var(--font-heading);
  }
`;

const DocumentInfoMeta = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

const DocumentContent = styled.div`
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
`;

const ProcessingModule = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
`;

const ProcessingHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const ProcessingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
`;

const ProcessingSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--text-secondary);
`;

const FormatOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
`;

const FormatOption = styled.button`
  padding: var(--space-3);
  border: 1px solid ${props => props.active ? 'var(--teal-500)' : 'var(--gray-300)'};
  background: ${props => props.active ? 'var(--teal-50)' : 'transparent'};
  color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-secondary)'};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    border-color: var(--teal-500);
    background: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-50)'};
    transform: translateY(-1px);
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: var(--space-6);
`;

const ProgressBar = styled.div`
  height: 8px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  margin-bottom: var(--space-2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: var(--teal-500);
    border-radius: var(--radius-full);
    transition: width var(--duration-md) var(--ease-out);
  }
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
  text-align: center;
`;

const ProcessingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  color: var(--text-secondary);
`;

const StatusIcon = styled.div`
  font-size: 1.25rem;
  color: var(--teal-500);
`;

const StatusText = styled.div`
  font-size: 0.9375rem;
`;

export default Processing;
