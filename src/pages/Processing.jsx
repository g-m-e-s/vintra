import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';

const Processing = () => {
  const [selectedFormats, setSelectedFormats] = useState({
    vintra: true,
    soap: true,
    ipissima: false,
    narrative: false,
    orientacoes: false,
  });
  
  const toggleFormat = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };
  
  return (
    <DocumentWorkspace>
      <DocumentToolbar>
        <DocumentInfoHeader>
          <DocumentInfoIcon>
            <i className="fas fa-cogs"></i>
          </DocumentInfoIcon>
          <DocumentInfoDetails>
            <h2>Processar Documento</h2>
            <DocumentInfoMeta>
              <span id="processingDocumentTitle">Documento Base</span>
            </DocumentInfoMeta>
          </DocumentInfoDetails>
        </DocumentInfoHeader>
      </DocumentToolbar>
      
      <DocumentContent>
        <ProcessingModule>
          <ProcessingHeader>
            <ProcessingTitle>Processamento VINTRA</ProcessingTitle>
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
          
          <ButtonContainer>
            <Button variant="primary">
              <i className="fas fa-cogs"></i> Iniciar Processamento
            </Button>
          </ButtonContainer>
          
          <ContentPlaceholder>
            <i className="fas fa-cogs"></i>
            <p>Funcionalidade de processamento em desenvolvimento.</p>
            <p>Selecione os formatos desejados acima e clique em Iniciar Processamento.</p>
          </ContentPlaceholder>
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
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: var(--space-5);
    right: var(--space-5);
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(6, 182, 212, 0.2) 20%,
      rgba(6, 182, 212, 0.4) 50%,
      rgba(6, 182, 212, 0.2) 80%,
      transparent 100%);
    opacity: 0.3;
    clip-path: polygon(
      0% 0%, 7% 30%, 13% 0%, 23% 40%, 33% 10%, 43% 50%, 53% 0%, 63% 35%, 73% 5%, 83% 45%, 93% 15%, 100% 30%, 100% 100%, 0% 100%
    );
  }
`;

const DocumentInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  flex: 1;
  margin-right: var(--space-4);
`;

const DocumentInfoIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: var(--text-secondary);
  transition: transform var(--duration-md) var(--ease-out);
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--warning-subtle);
  color: var(--warning-vivid);
`;

const DocumentInfoDetails = styled.div`
  min-width: 0;
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-1);
    color: var(--text-primary);
    letter-spacing: -0.01em;
    font-family: var(--font-heading);
  }
`;

const DocumentInfoMeta = styled.div`
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocumentContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: var(--space-5);
`;

const ProcessingModule = styled.div`
  padding: var(--space-8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  transition: all var(--duration-lg) var(--ease-gentle);
  box-shadow: var(--shadow-lg);
  max-width: 700px;
  margin: 0 auto;
  
  &:hover {
    box-shadow: var(--shadow-xl);
  }
`;

const ProcessingHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-6);
`;

const ProcessingTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-family: var(--font-heading);
`;

const ProcessingSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--text-secondary);
`;

const FormatOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);
  margin-bottom: var(--space-6);
`;

const FormatOption = styled.div`
  padding: var(--space-3) var(--space-5);
  border: 1px solid ${props => props.active ? 'var(--teal-400)' : 'var(--border-color)'};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  font-size: 0.9375rem;
  text-align: center;
  background-color: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-50)'};
  position: relative;
  overflow: hidden;
  color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-primary)'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  box-shadow: ${props => props.active ? '0 0 0 2px rgba(6, 182, 212, 0.1)' : 'none'};
  
  &:hover {
    border-color: ${props => props.active ? 'var(--teal-400)' : 'var(--gray-400)'};
    background-color: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-100)'};
    transform: translateY(-1px);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
`;

const ContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
  color: var(--text-tertiary);
  margin-top: var(--space-8);
  
  i {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.3;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: var(--space-2);
  }
`;

export default Processing;
