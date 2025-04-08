// src/pages/Library.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUI } from '../hooks/useUI';

const Library = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { showError } = useUI();

  useEffect(() => {
    // Em uma app real, isso viria da API
    const mockDocuments = [
      { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria_2503.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', size: '15.3 MB', duration: '28:45' },
      { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria_2503.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', size: '5 KB' },
      { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria_2503.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', size: '8 KB' },
      { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria_2503.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', size: '3 KB' }
    ];
    
    setDocuments(mockDocuments);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.type === filter;
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <h3>Repositório do Paciente</h3>
          <ActionButton>
            <i className="fas fa-plus"></i> Novo
          </ActionButton>
        </SidebarHeader>
        
        <SearchContainer>
          <SearchIcon className="fas fa-search" />
          <SearchInput 
            placeholder="Buscar documentos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <Filters>
          <Filter 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            Todos
          </Filter>
          <Filter 
            active={filter === 'audio'} 
            onClick={() => setFilter('audio')}
          >
            Áudios
          </Filter>
          <Filter 
            active={filter === 'transcription'} 
            onClick={() => setFilter('transcription')}
          >
            Transcrições
          </Filter>
          <Filter 
            active={filter === 'vintra'} 
            onClick={() => setFilter('vintra')}
          >
            VINTRA
          </Filter>
          <Filter 
            active={filter === 'soap'} 
            onClick={() => setFilter('soap')}
          >
            SOAP
          </Filter>
        </Filters>
        
        <DocumentsList>
          {filteredDocuments.length === 0 ? (
            <EmptyMessage>Nenhum documento encontrado.</EmptyMessage>
          ) : (
            filteredDocuments.map(doc => (
              <DocumentItem 
                key={doc.id}
                active={selectedDocument?.id === doc.id}
                onClick={() => handleDocumentSelect(doc)}
              >
                <DocumentIcon>
                  <i className={doc.icon}></i>
                </DocumentIcon>
                <DocumentInfo>
                  <DocumentTitle>{doc.title}</DocumentTitle>
                  <DocumentMeta>{doc.date}</DocumentMeta>
                </DocumentInfo>
              </DocumentItem>
            ))
          )}
        </DocumentsList>
      </Sidebar>
      
      <Content>
        {selectedDocument ? (
          <>
            <DocumentHeader>
              <div className="document-info">
                <div className="document-icon">
                  <i className={selectedDocument.icon}></i>
                </div>
                <div>
                  <h2>{selectedDocument.title}</h2>
                  <div className="document-meta">
                    <span>{selectedDocument.date}</span>
                    <span>{selectedDocument.time}</span>
                    {selectedDocument.size && <span>{selectedDocument.size}</span>}
                    {selectedDocument.duration && <span>{selectedDocument.duration}</span>}
                  </div>
                </div>
              </div>
              <div className="document-actions">
                <ActionButton>
                  <i className="fas fa-edit"></i> Editar
                </ActionButton>
                <ActionButton>
                  <i className="fas fa-download"></i> Download
                </ActionButton>
              </div>
            </DocumentHeader>
            
            <DocumentContent>
              <DocumentPreview>
                {selectedDocument.type === 'audio' ? (
                  <AudioPlaceholder>
                    <i className="fas fa-file-audio"></i>
                    <p>Pré-visualização de áudio não disponível.</p>
                  </AudioPlaceholder>
                ) : (
                  <TextPlaceholder>
                    <p>Conteúdo do documento será exibido aqui.</p>
                  </TextPlaceholder>
                )}
              </DocumentPreview>
            </DocumentContent>
          </>
        ) : (
          <EmptyState>
            <i className="fas fa-file-alt"></i>
            <h3>Nenhum documento selecionado</h3>
            <p>Selecione um documento da lista à esquerda para visualizá-lo.</p>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

// Estilos - adicione aqui seus styled components

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Sidebar = styled.div`
  width: 320px;
  background: rgba(250, 250, 252, 0.4);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  flex-direction: column;
  z-index: 3;
  position: relative;
  height: 100%;
  flex-shrink: 0;
  overflow-y: hidden;
  border-right: 1px solid var(--border-color);
`;

const SidebarHeader = styled.div`
  padding: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--text-secondary);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  
  &:hover {
    color: var(--accent-vivid);
  }
  
  i {
    font-size: 0.875em;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin: var(--space-4);
`;

const SearchIcon = styled.i`
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 0.75rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-8);
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 0.8125rem;
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-sm);
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0 var(--space-4) var(--space-4);
`;

const Filter = styled.button`
  padding: var(--space-1) var(--space-3);
  background: ${props => props.active ? 'var(--teal-500)' : 'var(--gray-100)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  font-size: 0.75rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-500)' : 'var(--gray-200)'};
  }
`;

const DocumentsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--space-4) var(--space-4);
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-3);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-2);
  background-color: ${props => props.active ? 'var(--accent-subtle)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--accent-light)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent-subtle)' : 'var(--gray-50)'};
  }
`;

const DocumentIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-3);
  border-radius: var(--radius-md);
  background-color: var(--gray-100);
  color: var(--accent);
`;

const DocumentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocumentTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--space-1);
`;

const DocumentMeta = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-white);
`;

const DocumentHeader = styled.div`
  padding: var(--space-4) var(--space-6);
  background: var(--gray-50);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .document-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .document-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    background-color: var(--teal-100);
    color: var(--teal-700);
  }
  
  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-1);
  }
  
  .document-meta {
    font-size: 0.8125rem;
    color: var(--text-tertiary);
    display: flex;
    gap: var(--space-3);
  }
  
  .document-actions {
    display: flex;
    gap: var(--space-2);
  }
`;

const DocumentContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
`;

const DocumentPreview = styled.div`
  background: var(--surface-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-height: 300px;
  box-shadow: var(--shadow-sm);
`;

const AudioPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
  
  i {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.3;
  }
`;

const TextPlaceholder = styled.div`
  color: var(--text-tertiary);
  font-style: italic;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  text-align: center;
  
  i {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.2;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--space-2);
    color: var(--text-primary);
  }
  
  p {
    max-width: 400px;
  }
`;

const EmptyMessage = styled.p`
  color: var(--text-tertiary);
  font-style: italic;
  text-align: center;
  padding: var(--space-4);
`;

export default Library;