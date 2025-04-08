// src/pages/Documentation.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../hooks/useUI';

const Documentation = () => {
  const navigate = useNavigate();
  const { showSuccess } = useUI();
  const [activeTab, setActiveTab] = useState('transcription');
  const [selectedDocument, setSelectedDocument] = useState('soap');
  
  // Simulação de transcrição gerada
  const mockTranscription = `Médico: Bom dia, Carlos. Como está se sentindo hoje?

Paciente: Bom dia, doutor. Não estou muito bem. Tenho sentido dores nas costas há alguns dias.

Médico: Entendo. Pode me dizer onde exatamente está a dor?

Paciente: É na parte baixa das costas, na região lombar. Às vezes irradia para a perna direita.

Médico: A dor começou após algum evento específico? Algum movimento brusco ou esforço?

Paciente: Na verdade, acho que foi após carregar algumas caixas pesadas durante uma mudança no fim de semana.

Médico: Compreendo. Essa dor interfere nas suas atividades diárias? Como está seu sono?

Paciente: Sim, está difícil ficar muito tempo sentado no trabalho. À noite também tenho dificuldade para encontrar uma posição confortável para dormir.

Médico: Já tomou algum medicamento para aliviar a dor?

Paciente: Tomei alguns anti-inflamatórios que tinha em casa, mas o alívio foi temporário.

Médico: Vou te examinar e depois discutiremos as opções de tratamento, ok?

Paciente: Ok, doutor.`;

  // Simulação dos documentos gerados
  const mockDocuments = {
    soap: `# SOAP - Carlos Pereira (15/03/2025)

## S (Subjetivo)
Paciente masculino, 55 anos, relata dor na região lombar há alguns dias, com irradiação ocasional para a perna direita. Relaciona o início dos sintomas com o esforço físico durante uma mudança no fim de semana. Refere dificuldade para permanecer sentado por longos períodos e desconforto ao dormir. Tentou uso de anti-inflamatórios com alívio temporário.

## O (Objetivo)
* Pressão Arterial: 130/85 mmHg
* Frequência Cardíaca: 72 bpm
* Temperatura: 36.5°C
* Teste de Lasègue positivo à direita
* Força muscular preservada em MMII
* Reflexos tendinosos normais

## A (Avaliação)
Lombalgia aguda com componente ciático à direita, provavelmente secundária a esforço físico. Possível hérnia discal lombar.

## P (Plano)
1. Prescrição de anti-inflamatório não esteroidal por 5 dias
2. Relaxante muscular ao deitar
3. Repouso relativo, evitando esforços físicos
4. Solicitar RX da coluna lombar e RNM se não houver melhora
5. Encaminhamento para fisioterapia
6. Retorno em 7 dias para reavaliação`,

    ipsissima: `# Ipsissima Verba - Carlos Pereira (15/03/2025)

## Contexto
Consulta de retorno para avaliação de lombalgia aguda

## Frases significativas do paciente
* "Tenho sentido dores nas costas há alguns dias."
* "É na parte baixa das costas, na região lombar. Às vezes irradia para a perna direita."
* "Acho que foi após carregar algumas caixas pesadas durante uma mudança no fim de semana."
* "Está difícil ficar muito tempo sentado no trabalho."
* "À noite também tenho dificuldade para encontrar uma posição confortável para dormir."
* "Tomei alguns anti-inflamatórios que tinha em casa, mas o alívio foi temporário."

## Observações não-verbais
* Paciente demonstra expressão facial de desconforto ao sentar
* Movimenta-se com cuidado ao mudar de posição
* Aponta com precisão a localização da dor durante o relato

## Interpretação
O paciente apresenta sinais típicos de comprometimento disco-radicular, com probable componente inflamatório agudo secundário a esforço físico. A irradiação para membro inferior sugere comprometimento do nervo ciático.`,

    vintra: `# Análise VINTRA - Carlos Pereira (15/03/2025)

## Narrativa Estruturada
O Sr. Carlos, 55 anos, busca atendimento devido a quadro de lombalgia com início após esforço físico. 
Apresenta comprometimento das atividades diárias e do sono. Exame físico evidencia sinais de 
comprometimento radicular. O quadro é compatível com lombalgia aguda com ciatalgia, possivelmente 
associada a hérnia discal lombar. Proposto tratamento medicamentoso, repouso relativo e fisioterapia.

## Dimensões Multifatoriais
1. **Dimensão Biológica**:
   * Possível compressão nervosa por protrusão/hérnia discal
   * Processo inflamatório local
   * Contração muscular reativa

2. **Dimensão Funcional**:
   * Limitação para atividades laborais em posição sentada
   * Comprometimento da qualidade do sono
   * Restrição temporária para atividades com esforço físico

3. **Dimensão Psicológica**:
   * Preocupação com limitações nas atividades diárias
   * Desconforto persistente gerando ansiedade

4. **Dimensão Social**:
   * Potencial afastamento temporário do trabalho
   * Necessidade de auxílio para atividades domésticas

## Trajetória Relacional Médico-Paciente
O paciente demonstra confiança no relato e cooperação durante o exame físico. Mantém 
expectativas realistas quanto ao tratamento. O vínculo terapêutico está bem estabelecido, 
com boa comunicação.

## Recomendações Integradas
* Abordagem inicial farmacológica com AINE e relaxante muscular
* Orientações ergonômicas para atividades diárias e laborais
* Fisioterapia para alívio dos sintomas e prevenção de recorrências
* Modificações ambientais temporárias (ajuste de colchão, posição de trabalho)
* Monitorização da evolução dos sintomas com seguimento próximo`,

    narrative: `# Análise Narrativa da Consulta - Carlos Pereira (15/03/2025)

## História da Doença Atual
Carlos Pereira, 55 anos, apresenta-se à consulta com queixa de lombalgia há alguns dias, 
com irradiação para membro inferior direito. O início dos sintomas coincide com esforço 
físico durante atividade de mudança residencial. O quadro é caracterizado por dor que 
limita a permanência na posição sentada e compromete a qualidade do sono. Houve tentativa 
de automedicação com anti-inflamatórios, porém com alívio apenas temporário dos sintomas.

## Contexto Biográfico
Paciente sem histórico prévio de doenças musculoesqueléticas significativas. O episódio atual 
está claramente relacionado a um evento específico (esforço físico durante mudança), que 
representa um marco na narrativa do adoecimento. A dor surge como elemento disruptivo em sua 
rotina, especialmente no trabalho, onde permanece sentado por longos períodos.

## Estrutura Simbólica
A dor lombar emerge como símbolo de um corpo que impõe limites ao excesso de esforço físico. 
A expressão "carregar caixas pesadas" revela uma possível sobrecarga de responsabilidades, tanto 
no sentido literal quanto metafórico. A dificuldade para encontrar "posição confortável" 
durante o sono pode simbolizar um período de adaptação e ajuste a novas circunstâncias.

## Análise do Discurso Médico-Paciente
O diálogo se desenvolve em uma estrutura clássica de anamnese, com alternância entre perguntas 
direcionadas do médico e respostas descritivas do paciente. Observa-se colaboração mútua na 
construção do entendimento sobre a condição. O médico utiliza linguagem acessível e demonstra 
empatia, enquanto o paciente oferece respostas diretas e contextualizadas, facilitando a 
compreensão do quadro clínico.

## Integração e Significado
Este episódio de lombalgia aguda representa um momento de vulnerabilidade física que demanda adaptações 
na rotina do paciente. A narrativa construída na consulta permite identificar não apenas o mecanismo 
biomecânico do problema, mas também seu impacto nas diversas esferas da vida do paciente. O tratamento 
proposto busca não apenas o alívio sintomático, mas a restauração da funcionalidade e autonomia, 
respeitando o significado particular desse adoecimento na trajetória biográfica do Sr. Carlos.`
  };

  // Simula salvar documento no repositório
  const saveToRepository = () => {
    showSuccess('Documento Salvo', 'Documento adicionado ao repositório com sucesso.');
    setTimeout(() => navigate('/library'), 1000);
  };

  // Seleciona o conteúdo com base na aba ativa
  const getActiveContent = () => {
    if (activeTab === 'transcription') {
      return mockTranscription;
    } else {
      return mockDocuments[selectedDocument];
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          <HeaderIcon>
            <i className="fas fa-file-medical-alt"></i>
          </HeaderIcon>
          <div>
            <Title>Documentação</Title>
            <Subtitle>Transcrições e documentos gerados a partir das consultas</Subtitle>
          </div>
        </HeaderTitle>
      </Header>
      
      <ContentLayout>
        <Sidebar>
          <SidebarHeader>Documentos Disponíveis</SidebarHeader>
          
          <DocumentTabs>
            <DocumentTab 
              active={activeTab === 'transcription'} 
              onClick={() => setActiveTab('transcription')}
            >
              <i className="fas fa-file-alt"></i>
              Transcrição Original
            </DocumentTab>
            
            <DocumentTab 
              active={activeTab === 'generated'} 
              onClick={() => setActiveTab('generated')}
            >
              <i className="fas fa-file-medical"></i>
              Documentos Gerados
            </DocumentTab>
          </DocumentTabs>
          
          {activeTab === 'generated' && (
            <DocumentList>
              <DocumentItem 
                active={selectedDocument === 'soap'} 
                onClick={() => setSelectedDocument('soap')}
              >
                <DocumentIcon>
                  <i className="fas fa-notes-medical"></i>
                </DocumentIcon>
                <DocumentInfo>
                  <DocumentName>SOAP</DocumentName>
                  <DocumentDescription>Estrutura clínica padrão</DocumentDescription>
                </DocumentInfo>
              </DocumentItem>
              
              <DocumentItem 
                active={selectedDocument === 'ipsissima'} 
                onClick={() => setSelectedDocument('ipsissima')}
              >
                <DocumentIcon>
                  <i className="fas fa-quote-right"></i>
                </DocumentIcon>
                <DocumentInfo>
                  <DocumentName>Ipsissima Verba</DocumentName>
                  <DocumentDescription>Frases e expressões significativas</DocumentDescription>
                </DocumentInfo>
              </DocumentItem>
              
              <DocumentItem 
                active={selectedDocument === 'vintra'} 
                onClick={() => setSelectedDocument('vintra')}
              >
                <DocumentIcon>
                  <i className="fas fa-project-diagram"></i>
                </DocumentIcon>
                <DocumentInfo>
                  <DocumentName>VINTRA</DocumentName>
                  <DocumentDescription>Análise multidimensional</DocumentDescription>
                </DocumentInfo>
              </DocumentItem>
              
              <DocumentItem 
                active={selectedDocument === 'narrative'} 
                onClick={() => setSelectedDocument('narrative')}
              >
                <DocumentIcon>
                  <i className="fas fa-book-medical"></i>
                </DocumentIcon>
                <DocumentInfo>
                  <DocumentName>Análise Narrativa</DocumentName>
                  <DocumentDescription>Abordagem narrativa e simbólica</DocumentDescription>
                </DocumentInfo>
              </DocumentItem>
            </DocumentList>
          )}
          
          <ActionButtons>
            <Button variant="primary" size="small" onClick={saveToRepository}>
              <i className="fas fa-save"></i> Salvar no Repositório
            </Button>
            
            <Button variant="secondary" size="small" onClick={() => navigate('/new-consultation')}>
              <i className="fas fa-plus"></i> Nova Consulta
            </Button>
          </ActionButtons>
        </Sidebar>
        
        <MainContent>
          <DocumentTitle>
            {activeTab === 'transcription' 
              ? 'Transcrição da Consulta - Carlos Pereira (15/03/2025)' 
              : selectedDocument === 'soap' ? 'SOAP'
              : selectedDocument === 'ipsissima' ? 'Ipsissima Verba'
              : selectedDocument === 'vintra' ? 'Análise VINTRA'
              : 'Análise Narrativa'
            }
          </DocumentTitle>
          
          <ContentContainer>
            <pre>{getActiveContent()}</pre>
          </ContentContainer>
        </MainContent>
      </ContentLayout>
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

const ContentLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background-color: var(--gray-50);
  
  @media (max-width: 768px) {
    width: 100%;
    order: 2;
    border-right: none;
    border-top: 1px solid var(--border-color);
  }
`;

const SidebarHeader = styled.div`
  padding: var(--space-4);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-light);
`;

const DocumentTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color-light);
`;

const DocumentTab = styled.button`
  flex: 1;
  padding: var(--space-3);
  text-align: center;
  background: ${props => props.active ? 'var(--teal-50)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--teal-500)' : 'transparent'};
  color: ${props => props.active ? 'var(--teal-700)' : 'var(--text-secondary)'};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  
  i {
    font-size: 1rem;
    margin-bottom: var(--space-1);
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-100)'};
  }
`;

const DocumentList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const DocumentItem = styled.div`
  padding: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  background: ${props => props.active ? 'var(--teal-50)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? 'var(--teal-500)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-50)' : 'var(--gray-100)'};
  }
`;

const DocumentIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background-color: var(--teal-100);
  color: var(--teal-700);
  flex-shrink: 0;
`;

const DocumentInfo = styled.div`
  min-width: 0;
`;

const DocumentName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
`;

const DocumentDescription = styled.div`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButtons = styled.div`
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-top: 1px solid var(--border-color-light);
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
  background-color: var(--surface-background);
`;

const DocumentTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const ContentContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  
  pre {
    font-family: var(--font-body);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.6;
    font-size: 0.9375rem;
  }
`;

export default Documentation;
