import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import Button from '../common/Button';

const DimensionalModal = ({ _patientData, onClose }) => {
  const [activeView, setActiveView] = useState('radar');
  const [dimensionalData] = useState({
    cognitiva: {
      atencao: 15,
      memoria: 16,
      raciocinio: 14,
      dissonancia: 12
    },
    afetiva: {
      ansiedade: 13,
      humor: 15,
      afeto: 17
    },
    autonomia: {
      autocontrole: 14,
      perspectivaTemporal: {
        passado: 12,
        presente: 15,
        futuro: 16,
        media: 14.3
      }
    },
    social: {
      relacionamentos: 16,
      trabalho: 13,
      lazer: 15
    }
  });

  const radarData = [
    { dimension: 'Cognitivo', value: dimensionalData.cognitiva.raciocinio },
    { dimension: 'Afetivo', value: dimensionalData.afetiva.humor },
    { dimension: 'Autonomia', value: dimensionalData.autonomia.autocontrole },
    { dimension: 'Social', value: dimensionalData.social.relacionamentos }
  ];

  const trajectoryData = [
    { session: 'Sessão 1', cognitivo: 12, afetivo: 10, autonomia: 11, social: 13 },
    { session: 'Sessão 2', cognitivo: 13, afetivo: 12, autonomia: 12, social: 14 },
    { session: 'Sessão 3', cognitivo: 14, afetivo: 13, autonomia: 13, social: 15 },
    { session: 'Atual', cognitivo: 15, afetivo: 15, autonomia: 14, social: 16 }
  ];

  const topologicalData = {
    nodes: [
      { id: 'cognitivo', label: 'Cognitivo', group: 1 },
      { id: 'afetivo', label: 'Afetivo', group: 2 },
      { id: 'autonomia', label: 'Autonomia', group: 3 },
      { id: 'social', label: 'Social', group: 4 },
      // Subnós
      { id: 'atencao', label: 'Atenção', group: 1 },
      { id: 'memoria', label: 'Memória', group: 1 },
      { id: 'ansiedade', label: 'Ansiedade', group: 2 },
      { id: 'humor', label: 'Humor', group: 2 },
      { id: 'perspectiva', label: 'Perspectiva Temporal', group: 3 },
      { id: 'relacionamentos', label: 'Relacionamentos', group: 4 }
    ],
    links: [
      { source: 'cognitivo', target: 'atencao', value: dimensionalData.cognitiva.atencao },
      { source: 'cognitivo', target: 'memoria', value: dimensionalData.cognitiva.memoria },
      { source: 'afetivo', target: 'ansiedade', value: dimensionalData.afetiva.ansiedade },
      { source: 'afetivo', target: 'humor', value: dimensionalData.afetiva.humor },
      { source: 'autonomia', target: 'perspectiva', value: dimensionalData.autonomia.perspectivaTemporal.media },
      { source: 'social', target: 'relacionamentos', value: dimensionalData.social.relacionamentos }
    ]
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalTitle>Visualização Dimensional</ModalTitle>
        <CloseButton onClick={onClose}>
          <i className="fas fa-times"></i>
        </CloseButton>
      </ModalHeader>
      
      <ModalBody>
        <ViewTabs>
          <ViewTab
            active={activeView === 'radar'}
            onClick={() => setActiveView('radar')}
          >
            <i className="fas fa-spider"></i>
            Radar
          </ViewTab>
          <ViewTab
            active={activeView === 'trajectory'}
            onClick={() => setActiveView('trajectory')}
          >
            <i className="fas fa-chart-line"></i>
            Trajetória
          </ViewTab>
          <ViewTab
            active={activeView === 'topological'}
            onClick={() => setActiveView('topological')}
          >
            <i className="fas fa-project-diagram"></i>
            Topológica
          </ViewTab>
        </ViewTabs>
        
        <ViewContainer>
          {activeView === 'radar' && (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid gridType="circle" />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={30} domain={[0, 20]} />
                  <Radar
                    name="Dimensões"
                    dataKey="value"
                    stroke="var(--teal-500)"
                    fill="var(--teal-200)"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          
          {activeView === 'trajectory' && (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cognitivo" 
                    stroke="var(--teal-500)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="afetivo" 
                    stroke="var(--accent)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="autonomia" 
                    stroke="var(--success)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="social" 
                    stroke="var(--warning)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          
          {activeView === 'topological' && (
            <ChartContainer>
              <TopologicalView>
                <div className="node-container">
                  {topologicalData.nodes.map((node, index) => (
                    <Node 
                      key={node.id}
                      style={{
                        left: `${(index % 5) * 20}%`,
                        top: `${Math.floor(index / 5) * 25}%`
                      }}
                      group={node.group}
                    >
                      <NodeLabel>{node.label}</NodeLabel>
                    </Node>
                  ))}
                </div>
                <svg className="connections">
                  {topologicalData.links.map((link, index) => {
                    const sourceNode = topologicalData.nodes.find(n => n.id === link.source);
                    const targetNode = topologicalData.nodes.find(n => n.id === link.target);
                    const sourceIndex = topologicalData.nodes.indexOf(sourceNode);
                    const targetIndex = topologicalData.nodes.indexOf(targetNode);
                    
                    return (
                      <line
                        key={index}
                        x1={`${(sourceIndex % 5) * 20 + 10}%`}
                        y1={`${Math.floor(sourceIndex / 5) * 25 + 10}%`}
                        x2={`${(targetIndex % 5) * 20 + 10}%`}
                        y2={`${Math.floor(targetIndex / 5) * 25 + 10}%`}
                        stroke={`rgba(6, 182, 212, ${link.value / 20})`}
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </TopologicalView>
            </ChartContainer>
          )}
        </ViewContainer>
        
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalBody>
    </ModalContainer>
  );
};

const slideIn = keyframes`
  from { transform: translateY(40px); }
  to { transform: translateY(0); }
`;

const ModalContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(var(--blur-md));
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} var(--duration-lg) var(--ease-elastic) forwards;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: var(--space-6);
    right: var(--space-6);
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(6, 182, 212, 0.2) 20%,
      rgba(6, 182, 212, 0.4) 50%,
      rgba(6, 182, 212, 0.2) 80%,
      transparent 100%);
    opacity: 0.3;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-family: var(--font-heading);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  color: var(--text-tertiary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--duration-md) var(--ease-gentle);
  flex-shrink: 0;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--gray-100);
  }
`;

const ModalBody = styled.div`
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
  color: var(--text-primary);
`;

const ViewTabs = styled.div`
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: var(--space-2);
`;

const ViewTab = styled.button`
  padding: var(--space-3) var(--space-4);
  background: ${props => props.active ? 'var(--teal-700)' : 'none'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  font-weight: ${props => props.active ? '500' : 'normal'};
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  i {
    font-size: 1rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-700)' : 'rgba(255, 255, 255, 0.5)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const ViewContainer = styled.div`
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid var(--border-color-light);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const TopologicalView = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  
  .node-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .connections {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;

const Node = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch(props.group) {
      case 1: return 'var(--teal-100)';
      case 2: return 'var(--accent-light)';
      case 3: return 'var(--success-subtle)';
      case 4: return 'var(--warning-subtle)';
      default: return 'var(--gray-100)';
    }
  }};
  border: 2px solid ${props => {
    switch(props.group) {
      case 1: return 'var(--teal-500)';
      case 2: return 'var(--accent)';
      case 3: return 'var(--success)';
      case 4: return 'var(--warning)';
      default: return 'var(--gray-400)';
    }
  }};
  transition: all var(--duration-md) var(--ease-gentle);
  cursor: pointer;
  z-index: 2;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
  }
`;

const NodeLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: var(--text-primary);
  max-width: 90%;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-6);
`;

export default DimensionalModal;
