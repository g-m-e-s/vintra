import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Componente de visualização multidimensional para análise de dados de pacientes
 * Projetado para ser totalmente responsivo em dispositivos móveis
 */
const MultidimensionalView = ({ patientData, dimensions = ['clinico', 'emocional', 'social', 'cognitivo'] }) => {
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(false);
  
  // Dados simulados - em produção viriam da API
  const dimensionalData = {
    clinico: { 
      nivel: 7,
      indicadores: [
        { nome: 'Pressão arterial', valor: 'Controlada', tendencia: 'estavel' },
        { nome: 'Glicemia', valor: '110 mg/dL', tendencia: 'melhora' },
        { nome: 'Colesterol', valor: '180 mg/dL', tendencia: 'estavel' }
      ] 
    },
    emocional: { 
      nivel: 5,
      indicadores: [
        { nome: 'Ansiedade', valor: 'Moderada', tendencia: 'piora' },
        { nome: 'Depressão', valor: 'Leve', tendencia: 'melhora' },
        { nome: 'Estresse', valor: 'Moderado', tendencia: 'estavel' }
      ] 
    },
    social: { 
      nivel: 8,
      indicadores: [
        { nome: 'Suporte familiar', valor: 'Alto', tendencia: 'estavel' },
        { nome: 'Interação social', valor: 'Frequente', tendencia: 'melhora' },
        { nome: 'Ocupação', valor: 'Ativa', tendencia: 'estavel' }
      ] 
    },
    cognitivo: { 
      nivel: 6,
      indicadores: [
        { nome: 'Memória', valor: 'Preservada', tendencia: 'estavel' },
        { nome: 'Atenção', valor: 'Leve déficit', tendencia: 'melhora' },
        { nome: 'Funções executivas', valor: 'Adequadas', tendencia: 'estavel' }
      ] 
    }
  };

  // Manipula o redimensionamento da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Animação de entrada
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Seleciona uma dimensão
  const handleSelectDimension = (dimension) => {
    setSelectedDimension(dimension);
  };

  // Obtém o nível da dimensão atual
  const currentLevel = dimensionalData[selectedDimension]?.nivel || 0;
  
  // Obtém a cor baseada no nível
  const getLevelColor = (level) => {
    if (level < 4) return 'var(--error-vivid)';
    if (level < 7) return 'var(--warning-vivid)';
    return 'var(--success-vivid)';
  };
  
  // Obtém o ícone para a tendência
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'melhora': return <i className="fas fa-arrow-up" style={{ color: 'var(--success-vivid)' }} />;
      case 'piora': return <i className="fas fa-arrow-down" style={{ color: 'var(--error-vivid)' }} />;
      default: return <i className="fas fa-minus" style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <MultidimensionalContainer visible={isVisible}>
      <ViewTitle>{isMobile ? 'Dimensões' : 'Visualização Multidimensional'}</ViewTitle>
      
      {/* Seletor de dimensões - cria abas ou lista dependendo da tela */}
      <DimensionSelector isMobile={isMobile}>
        {dimensions.map(dimension => (
          <DimensionTab 
            key={dimension}
            active={selectedDimension === dimension}
            onClick={() => handleSelectDimension(dimension)}
          >
            <DimensionIcon className={`fas fa-${getDimensionIcon(dimension)}`} />
            <span>{capitalizeFirstLetter(dimension)}</span>
          </DimensionTab>
        ))}
      </DimensionSelector>
      
      {/* Visualização principal - adapta-se para layout vertical em mobile */}
      <DimensionView isMobile={isMobile}>
        <LevelIndicator>
          <LevelLabel>Nível</LevelLabel>
          <LevelValue color={getLevelColor(currentLevel)}>
            {currentLevel} / 10
          </LevelValue>
          <LevelBar>
            <LevelProgress level={currentLevel} color={getLevelColor(currentLevel)} />
          </LevelBar>
        </LevelIndicator>
        
        <IndicatorList>
          {dimensionalData[selectedDimension]?.indicadores.map((indicator, index) => (
            <IndicatorItem key={index}>
              <IndicatorName>{indicator.nome}</IndicatorName>
              <IndicatorValue>
                {indicator.valor} {getTrendIcon(indicator.tendencia)}
              </IndicatorValue>
            </IndicatorItem>
          ))}
        </IndicatorList>
      </DimensionView>
      
      {/* Botões de ação - sempre visíveis, mais compactos em mobile */}
      <ActionButtons>
        <ActionButton>
          <i className="fas fa-chart-line"></i>
          {!isMobile && <span>Evolução</span>}
        </ActionButton>
        <ActionButton>
          <i className="fas fa-print"></i>
          {!isMobile && <span>Relatório</span>}
        </ActionButton>
      </ActionButtons>
    </MultidimensionalContainer>
  );
};

// Funções auxiliares
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getDimensionIcon = (dimension) => {
  switch (dimension) {
    case 'clinico': return 'heartbeat';
    case 'emocional': return 'brain';
    case 'social': return 'users';
    case 'cognitivo': return 'lightbulb';
    default: return 'circle';
  }
};

// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estilos
const MultidimensionalContainer = styled.div`
  background: var(--surface-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--teal-200);
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? 0 : '10px'});
  transition: all 0.5s var(--ease-gentle);
  
  @media (max-width: 768px) {
    padding: var(--space-3);
    gap: var(--space-3);
    border-radius: var(--radius-lg);
    margin: 0;
    width: 100%;
  }
`;

const ViewTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 1.25rem;
    background: var(--teal-500);
    border-radius: var(--radius-sm);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DimensionSelector = styled.div`
  display: flex;
  gap: var(--space-2);
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: var(--space-2);
  
  @media (max-width: 768px) {
    ${props => props.isMobile && `
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      scroll-snap-type: x mandatory;
      padding-bottom: var(--space-1);
    `}
  }
`;

const DimensionTab = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s var(--ease-gentle);
  background: ${props => props.active ? 'var(--teal-100)' : 'transparent'};
  color: ${props => props.active ? 'var(--teal-900)' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'var(--teal-200)' : 'transparent'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  animation: ${fadeIn} 0.3s ease;
  scroll-snap-align: start;
  
  &:hover {
    background: ${props => props.active ? 'var(--teal-100)' : 'var(--gray-100)'};
  }
  
  @media (max-width: 768px) {
    padding: var(--space-1) var(--space-2);
    font-size: 0.875rem;
  }
`;

const DimensionIcon = styled.i`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--teal-600);
`;

const DimensionView = styled.div`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  gap: var(--space-4);
  animation: ${fadeIn} 0.5s ease;
  
  @media (max-width: 768px) {
    gap: var(--space-3);
  }
`;

const LevelIndicator = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  
  @media (max-width: 768px) {
    gap: var(--space-1);
  }
`;

const LevelLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const LevelValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.color || 'var(--text-primary)'};
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LevelBar = styled.div`
  height: 12px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 8px;
  }
`;

const LevelProgress = styled.div`
  height: 100%;
  width: ${props => props.level * 10}%;
  background: ${props => props.color || 'var(--teal-500)'};
  border-radius: var(--radius-full);
  transition: width 0.6s var(--ease-out);
`;

const IndicatorList = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  
  @media (max-width: 768px) {
    gap: var(--space-2);
  }
`;

const IndicatorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  
  @media (max-width: 768px) {
    padding: var(--space-1) var(--space-2);
  }
`;

const IndicatorName = styled.div`
  font-weight: 500;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const IndicatorValue = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--teal-50);
  color: var(--teal-700);
  border: 1px solid var(--teal-200);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s var(--ease-gentle);
  
  &:hover {
    background: var(--teal-100);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-2);
    flex: 1;
    font-size: 1rem;
  }
`;

export default MultidimensionalView;
