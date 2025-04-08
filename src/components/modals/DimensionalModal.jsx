import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * Modal for dimensional visualizations
 */
const DimensionalModal = ({ patientData, onClose }) => {
  const [activeView, setActiveView] = useState('radar');

  // Example dimensional data
  const dimensionalData = patientData || {
    emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
    cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
    autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
  };

  // Prepare radar chart data
  const radarData = [
    { dimension: 'Valência', value: dimensionalData.emocional.valencia + 10 }, // Offset to make negative values visible
    { dimension: 'Excitação', value: dimensionalData.emocional.excitacao },
    { dimension: 'Dominância', value: dimensionalData.emocional.dominancia },
    { dimension: 'Intensidade', value: dimensionalData.emocional.intensidade },
    { dimension: 'Complexidade', value: dimensionalData.cognitiva.complexidade },
    { dimension: 'Coerência', value: dimensionalData.cognitiva.coerencia },
    { dimension: 'Flexibilidade', value: dimensionalData.cognitiva.flexibilidade },
    { dimension: 'Dissonância', value: dimensionalData.cognitiva.dissonancia },
    { dimension: 'Persp. Temporal', value: dimensionalData.autonomia.perspectivaTemporal.media },
    { dimension: 'Autocontrole', value: dimensionalData.autonomia.autocontrole }
  ];

  return (
    <ModalContainer>
      <ModalHeader>
        <ModalTitle>Visualização Dimensional</ModalTitle>
        <CloseButton onClick={onClose}>
          <i className="fas fa-times"></i>
        </CloseButton>
      </ModalHeader>
      
      <ModalBody>
        {/* View tabs */}
        <ViewTabs>
          <ViewTab
            active={activeView === 'radar'}
            onClick={() => setActiveView('radar')}
          >
            Radar
          </ViewTab>
          <ViewTab
            active={activeView === 'trajectory'}
            onClick={() => setActiveView('trajectory')}
          >
            Trajetória
          </ViewTab>
          <ViewTab
            active={activeView === 'topological'}
            onClick={() => setActiveView('topological')}
          >
            Topológica
          </ViewTab>
        </ViewTabs>
        
        {/* View container */}
        <ViewContainer>
          {activeView === 'radar' && (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={30} domain={[0, 20]} /> {/* Domain adjusted for offset */}
                  <Radar
                    name="Análise dimensional"
                    dataKey="value"
                    stroke="var(--accent)"
                    fill="var(--accent-light)"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [(value - 10).toFixed(1), 'Valor']} /> {/* Revert offset for display */}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
          
          {activeView === 'trajectory' && (
            <PlaceholderView>
              <i className="fas fa-chart-line"></i>
              <p>Visualização de Trajetória em desenvolvimento.</p>
            </PlaceholderView>
          )}
          
          {activeView === 'topological' && (
            <PlaceholderView>
              <i className="fas fa-project-diagram"></i>
              <p>Visualização Topológica em desenvolvimento.</p>
            </PlaceholderView>
          )}
        </ViewContainer>
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
  max-width: 800px;
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
  
  /* Wavy bottom border */
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
    clip-path: polygon(
      0% 0%, 10% 40%, 20% 0%, 30% 50%, 40% 10%, 50% 40%, 60% 0%, 70% 50%, 80% 20%, 90% 50%, 100% 0%, 100% 100%, 0% 100%
    );
    transform: scaleY(0.7);
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
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: var(--space-2);
`;

const ViewTab = styled.button`
  padding: var(--space-2) var(--space-4);
  background: ${props => props.active ? 'var(--teal-700)' : 'none'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  font-size: 0.875rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-md) var(--ease-gentle);
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--teal-700)' : 'rgba(255, 255, 255, 0.5)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const ViewContainer = styled.div`
  position: relative;
  height: 400px;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PlaceholderView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  
  i {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.4;
  }
  
  p {
    font-size: 1rem;
  }
`;

export default DimensionalModal;
