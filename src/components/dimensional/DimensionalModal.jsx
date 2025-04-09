import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import MultidimensionalView from './MultidimensionalView';

/**
 * Modal para visualização multidimensional
 * Adapta-se a telas móveis com design responsivo
 */
const DimensionalModal = ({ onClose, patientData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Verificar o tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Adicionar animação de entrada
    setTimeout(() => {
      setIsVisible(true);
    }, 50);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fecha o modal com animação
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <ModalOverlay visible={isVisible} onClick={handleClose}>
      <ModalContent 
        visible={isVisible} 
        isMobile={isMobile}
        onClick={e => e.stopPropagation()}
        data-testid="dimensional-modal"
      >
        <ModalHeader>
          <ModalTitle>
            {patientData?.name ? `Análise Multidimensional: ${patientData.name}` : 'Análise Multidimensional'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <i className="fas fa-times"></i>
          </CloseButton>
        </ModalHeader>
        
        <ModalBody isMobile={isMobile}>
          <MultidimensionalView patientData={patientData} />
        </ModalBody>
        
        <ModalFooter isMobile={isMobile}>
          <FooterNote>
            <i className="fas fa-info-circle"></i>
            <span>Esta análise é atualizada a cada consulta</span>
          </FooterNote>
          <CloseModalButton onClick={handleClose}>
            Fechar
          </CloseModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideInMobile = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

// Estilos
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, ${props => props.visible ? 0.5 : 0});
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(${props => props.visible ? 'var(--blur-sm)' : '0'});
  transition: all 0.3s var(--ease-out);
  padding: var(--space-4);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: var(--surface-modal);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: ${props => props.isMobile ? '100%' : '90%'};
  max-width: 900px;
  max-height: ${props => props.isMobile ? '85vh' : '90vh'};
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.3s var(--ease-out);
  animation: ${props => props.isMobile ? slideInMobile : slideIn} 0.3s var(--ease-out);
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    max-height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-color-light);
  
  @media (max-width: 768px) {
    padding: var(--space-3);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--gray-100);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease-gentle);
  
  &:hover {
    background: var(--gray-200);
    color: var(--text-primary);
    transform: rotate(90deg);
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const ModalBody = styled.div`
  padding: var(--space-4);
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    padding: var(--space-3);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-top: 1px solid var(--border-color-light);
  
  @media (max-width: 768px) {
    padding: var(--space-3);
    flex-direction: ${props => props.isMobile ? 'column-reverse' : 'row'};
    gap: var(--space-3);
  }
`;

const FooterNote = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  i {
    color: var(--teal-500);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
`;

const CloseModalButton = styled.button`
  padding: var(--space-2) var(--space-6);
  background: var(--teal-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s var(--ease-gentle);
  
  &:hover {
    background: var(--teal-600);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: var(--space-3);
  }
`;

export default DimensionalModal;
