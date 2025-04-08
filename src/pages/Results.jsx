import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';

const Results = () => {
  const [activeTab, setActiveTab] = useState('transcription-panel');
  
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
              <span id="resultsDocumentTitle">Resultados</span>
            </DocumentInfoMeta>
          </DocumentInfoDetails>
        </DocumentInfoHeader>
        
        <DocumentToolbarActions>
          <ToolbarButton>
            <i className="fas fa-edit"></i> Editar
          </ToolbarButton>
          <ToolbarButton>
            <i className="fas fa-download"></i> Download
          </ToolbarButton>
          <ToolbarButton>
            <i className="fas fa-folder-open"></i> Repositório
          </ToolbarButton>
        </DocumentToolbarActions>
      </DocumentToolbar>
      
      <DocumentTabs>
        <DocumentTab 
          active={activeTab === 'transcription-panel'}
          onClick={() => setActiveTab('transcription-panel')}
        >
          Transcrição
        </DocumentTab>
        <DocumentTab 
          active={activeTab === 'vintra-panel'}
          onClick={() => setActiveTab('vintra-panel')}
        >
          VINTRA
        </DocumentTab>
        <DocumentTab 
          active={activeTab === 'soap-panel'}
          onClick={() => setActiveTab('soap-panel')}
        >
          SOAP
        </DocumentTab>
        <DocumentTab 
          active={activeTab === 'ipissima-panel'}
          onClick={() => setActiveTab('ipissima-panel')}
        >
          Ipíssima
        </DocumentTab>
        <DocumentTab 
          active={activeTab === 'narrative-panel'}
          onClick={() => setActiveTab('narrative-panel')}
        >
          Narrativa
        </DocumentTab>
        <DocumentTab 
          active={activeTab === 'orientacoes-panel'}
          onClick={() => setActiveTab('orientacoes-panel')}
        >
          Orientações
        </DocumentTab>
      </DocumentTabs>
      
      <DocumentTabPanels>
        {activeTab === 'transcription-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <p><strong>Entrevista Clínica - 04 de Abril de 2025</strong></p>
                    <p><strong>Médico:</strong> Bom dia, Maria. Como você está se sentindo hoje?</p>
                    <p><strong>Paciente:</strong> Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. <em>(Suspira)</em> É difícil manter a esperança.</p>
                    <p><strong>Médico:</strong> Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?</p>
                    <p><strong>Paciente:</strong> Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.</p>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
        
        {activeTab === 'vintra-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <h1>Análise VINTRA - Maria Silva (04/04/2025)</h1>
                    <h2>Dimensões Emocionais</h2>
                    <p>- Valência (v₁): -2.5 (Negativa)</p>
                    <p>- Excitação (v₂): 7.0 (Alta)</p>
                    <p>- Dominância (v₃): 3.0 (Baixa)</p>
                    <p>- Intensidade (v₄): 8.0 (Alta)</p>
                    <p><em>A paciente demonstra um estado emocional marcado por valência negativa alta, sugerindo sofrimento psíquico significativo. A excitação elevada indica um estado de tensão interna persistente. A baixa dominância sugere sentimentos de impotência frente ao quadro clínico.</em></p>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
        
        {activeTab === 'soap-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <h1>Nota SOAP - Maria Silva (04/04/2025)</h1>
                    <h2>S (Subjetivo)</h2>
                    <p>Paciente relata persistência da dor, dificuldade para dormir e desânimo generalizado. Expressa sensação de desesperança quanto à melhora do quadro: "Às vezes acho que nunca vou melhorar". Menciona perda de interesse em atividades anteriormente prazerosas.</p>
                    <h2>O (Objetivo)</h2>
                    <p>Paciente apresenta-se abatida, com postura curvada e expressão facial de sofrimento. Observa-se suspiros frequentes durante o relato e tonalidade afetiva depressiva.</p>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
        
        {activeTab === 'ipissima-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <h1>Ipíssima Narrativa - Maria Silva (04/04/2025)</h1>
                    <p>Eu não aguento mais essa dor. Tomo os remédios que me passaram, mas parece que não adiantam nada. À noite é o pior momento, não consigo dormir direito, fico rolando na cama. Quando acordo, já estou cansada, como se não tivesse descansado nada.</p>
                    <p>Tem dias que acho que nunca vou melhorar. É difícil manter a esperança quando todo dia é a mesma coisa. Nem as coisas que eu gostava de fazer me animam mais. Perdi a vontade de tudo. É como se eu estivesse carregando um peso enorme que não consigo tirar de cima de mim.</p>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
        
        {activeTab === 'narrative-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <h1>Análise Narrativa - Maria Silva (04/04/2025)</h1>
                    <h2>Temas Centrais</h2>
                    <p>- Dor crônica persistente</p>
                    <p>- Perda de esperança</p>
                    <p>- Anedonia (perda de prazer)</p>
                    <p>- Dificuldades com sono</p>
                    <h2>Estrutura Narrativa</h2>
                    <p>A narrativa da paciente apresenta uma estrutura cíclica de sofrimento, onde a dor física alimenta o desânimo emocional, que por sua vez intensifica a percepção da dor. A temporalidade é marcada pela repetição ("todo dia é a mesma coisa"), com ausência de perspectiva futura positiva.</p>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
        
        {activeTab === 'orientacoes-panel' && (
          <DocumentTabPanel>
            <DocumentContent>
              <DocumentContainer>
                <DocumentView>
                  <ExampleContent>
                    <h1>Orientações - Maria Silva (04/04/2025)</h1>
                    <ol>
                      <li><strong>Medicação:</strong> Manter uso conforme prescrição. Registrar em diário níveis de dor (0-10) e efeitos da medicação.</li>
                      <li><strong>Higiene do Sono:</strong> Implementar rotina regular de sono, evitar telas 1h antes de dormir, manter ambiente tranquilo e temperatura adequada.</li>
                      <li><strong>Atividade Física:</strong> Iniciar caminhadas leves (5-10 min), aumentando gradualmente conforme tolerância.</li>
                      <li><strong>Suporte Psicológico:</strong> Encaminhamento para terapia cognitivo-comportamental focada em dor crônica.</li>
                    </ol>
                  </ExampleContent>
                </DocumentView>
              </DocumentContainer>
            </DocumentContent>
          </DocumentTabPanel>
        )}
      </DocumentTabPanels>
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
  background: var(--surface-white);
  backdrop-filter: blur(var(--blur-sm));
  transition: all var(--duration-md) var(--ease-gentle);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-sm);
  
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
  background-color: var(--success-subtle);
  color: var(--success-vivid);
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

const DocumentToolbarActions = styled.div`
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const ToolbarButton = styled.button`
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
  border: none;
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: all var(--duration-md) cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  overflow: hidden;
  position: relative;
  
  /* Shine effect */
  &:before {
    content: '';
    position: absolute;
    left: -100%;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s var(--ease-out);
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5));
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  i {
    font-size: 0.875em;
  }
`;

const DocumentTabs = styled.div`
  display: flex;
  gap: var(--space-1);
  padding: 0 var(--space-4);
  background-color: var(--gray-50);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DocumentTab = styled.button`
  padding: var(--space-3) var(--space-4);
  border-bottom: 3px solid ${props => props.active ? 'var(--teal-500)' : 'transparent'};
  margin-bottom: -1px;
  font-size: 0.875rem;
  color: ${props => props.active ? 'var(--teal-600)' : 'var(--text-secondary)'};
  transition: all var(--duration-md) var(--ease-gentle);
  white-space: nowrap;
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    color: ${props => props.active ? 'var(--teal-600)' : 'var(--text-primary)'};
  }
`;

const DocumentTabPanels = styled.div`
  background-color: var(--surface-white);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  flex: 1;
  position: relative;
`;

const DocumentTabPanel = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const DocumentContent = styled.div`
  padding: var(--space-6);
`;

const DocumentContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  max-width: 800px;
  margin: 0 auto;
  box-shadow: var(--shadow-sm);
  min-height: 100%;
  transition: all var(--duration-lg) var(--ease-gentle);
  overflow: hidden;
  padding: var(--space-6);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const DocumentView = styled.div`
  white-space: pre-wrap;
  line-height: 1.7;
  font-size: 0.9375rem;
  color: var(--text-primary);
`;

const ExampleContent = styled.div`
  h1 {
    font-size: 1.5rem;
    margin-bottom: var(--space-4);
    font-weight: 700;
    font-family: var(--font-heading);
    color: var(--text-primary);
  }
  
  h2 {
    font-size: 1.25rem;
    margin-bottom: var(--space-3);
    margin-top: var(--space-5);
    font-weight: 600;
    font-family: var(--font-heading);
    color: var(--text-primary);
  }
  
  p {
    margin-bottom: var(--space-3);
    font-size: 0.9375rem;
    line-height: 1.7;
  }
  
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
    color: var(--text-secondary);
  }
  
  ol, ul {
    margin-left: var(--space-5);
    margin-bottom: var(--space-4);
  }
  
  li {
    margin-bottom: var(--space-2);
  }
`;

export default Results;
