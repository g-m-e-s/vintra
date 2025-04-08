import { useState, useEffect } from 'react';
import React from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { vintraApi } from '../services/api';
import { useUI } from '../hooks/useUI';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useUI();
  const consultationId = location.state?.consultationId;

  const [activeTab, setActiveTab] = useState('transcription-panel');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({
    transcription: '',
    soap: '',
    ipissima: '',
    vintra: '',
    narrative: '',
    orientacoes: ''
  });

  useEffect(() => {
    if (!consultationId) {
      showError('Erro', 'ID da consulta não fornecido');
      navigate('/new-consultation');
      return;
    }

    const loadDocuments = async () => {
      try {
        // Carregar transcrição
        const transcription = await vintraApi.getTranscription(consultationId);
        
        // Carregar documentos gerados
        const docs = await vintraApi.getDocuments({ consultationId });
        
        setDocuments({
          transcription: transcription.text,
          soap: docs.find(d => d.type === 'soap')?.content || '',
          ipissima: docs.find(d => d.type === 'ipissima')?.content || '',
          vintra: docs.find(d => d.type === 'vintra')?.content || '',
          narrative: docs.find(d => d.type === 'narrative')?.content || '',
          orientacoes: docs.find(d => d.type === 'orientacoes')?.content || ''
        });
      } catch (error) {
        showError('Erro', 'Falha ao carregar documentos');
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [consultationId, navigate, showError]);

  const getCurrentDocument = () => {
    switch (activeTab) {
      case 'transcription-panel':
        return documents.transcription;
      case 'soap-panel':
        return documents.soap;
      case 'ipissima-panel':
        return documents.ipissima;
      case 'vintra-panel':
        return documents.vintra;
      case 'narrative-panel':
        return documents.narrative;
      case 'orientacoes-panel':
        return documents.orientacoes;
      default:
        return '';
    }
  };

  return (
    <DocumentWorkspace>
      <DocumentToolbar>
        <DocumentInfoHeader>
          <DocumentInfoIcon>
            <i className="fas fa-file-alt"></i>
          </DocumentInfoIcon>
          <DocumentInfoDetails>
            <h2>Resultados do Processamento</h2>
            <DocumentInfoMeta>
              <span id="resultsDocumentTitle">
                {activeTab === 'transcription-panel' ? 'Transcrição' :
                 activeTab === 'soap-panel' ? 'SOAP' :
                 activeTab === 'ipissima-panel' ? 'Ipíssima Verba' :
                 activeTab === 'vintra-panel' ? 'Análise VINTRA' :
                 activeTab === 'narrative-panel' ? 'Narrativa' :
                 'Orientações'}
              </span>
            </DocumentInfoMeta>
          </DocumentInfoDetails>
        </DocumentInfoHeader>
        
        <DocumentToolbarActions>
          <ToolbarButton onClick={() => {/* Implementar edição */}}>
            <i className="fas fa-edit"></i> Editar
          </ToolbarButton>
          <ToolbarButton onClick={() => {/* Implementar download */}}>
            <i className="fas fa-download"></i> Download
          </ToolbarButton>
          <ToolbarButton onClick={() => navigate('/library')}>
            <i className="fas fa-folder-open"></i> Repositório
          </ToolbarButton>
        </DocumentToolbarActions>
      </DocumentToolbar>
      
      <DocumentTabs>
        <DocumentTab 
          active={activeTab === 'transcription-panel'} 
          onClick={() => setActiveTab('transcription-panel')}
        >
          <i className="fas fa-file-alt"></i>
          Transcrição
        </DocumentTab>
        
        <DocumentTab 
          active={activeTab === 'soap-panel'}
          onClick={() => setActiveTab('soap-panel')}
        >
          <i className="fas fa-notes-medical"></i>
          SOAP
        </DocumentTab>
        
        <DocumentTab 
          active={activeTab === 'ipissima-panel'}
          onClick={() => setActiveTab('ipissima-panel')}
        >
          <i className="fas fa-quote-right"></i>
          Ipíssima
        </DocumentTab>
        
        <DocumentTab 
          active={activeTab === 'vintra-panel'}
          onClick={() => setActiveTab('vintra-panel')}
        >
          <i className="fas fa-brain"></i>
          VINTRA
        </DocumentTab>
        
        <DocumentTab 
          active={activeTab === 'narrative-panel'}
          onClick={() => setActiveTab('narrative-panel')}
        >
          <i className="fas fa-align-left"></i>
          Narrativa
        </DocumentTab>
        
        <DocumentTab 
          active={activeTab === 'orientacoes-panel'}
          onClick={() => setActiveTab('orientacoes-panel')}
        >
          <i className="fas fa-list-check"></i>
          Orientações
        </DocumentTab>
      </DocumentTabs>
      
      <DocumentContent>
        {loading ? (
          <LoadingContainer>
            <i className="fas fa-circle-notch fa-spin"></i>
            <p>Carregando documentos...</p>
          </LoadingContainer>
        ) : (
          <DocumentText>
            {getCurrentDocument()}
          </DocumentText>
        )}
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
  border-bottom: 1px solid var(--border-color-light);
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

const DocumentToolbarActions = styled.div`
  display: flex;
  gap: var(--space-2);
  
  @media (max-width: 768px) {
    margin-top: var(--space-3);
    width: 100%;
    justify-content: flex-end;
  }
`;

const ToolbarButton = styled(Button)`
  i {
    margin-right: var(--space-2);
  }
`;

const DocumentTabs = styled.div`
  display: flex;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-color-light);
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: var(--space-2);
    gap: var(--space-1);
  }
`;

const DocumentTab = styled.button`
  padding: var(--space-3) var(--space-4);
  background: ${props => props.active ? 'var(--teal-50)' : 'transparent'};
  color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-secondary)'};
  border: none;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  i {
    font-size: 1rem;
  }
  
  &:hover {
    background: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-50)'};
    color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-primary)'};
  }
  
  @media (max-width: 768px) {
    padding: var(--space-2);
    font-size: 0.8125rem;
    
    i {
      margin: 0;
    }
    
    span {
      display: none;
    }
  }
`;

const DocumentContent = styled.div`
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
  background: var(--gray-50);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  height: 100%;
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    color: var(--teal-500);
  }
`;

const DocumentText = styled.pre`
  font-family: var(--font-body);
  white-space: pre-wrap;
  padding: var(--space-6);
  background: var(--surface-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  line-height: 1.6;
  font-size: 0.9375rem;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    padding: var(--space-4);
    font-size: 0.875rem;
  }
`;

export default Results;
