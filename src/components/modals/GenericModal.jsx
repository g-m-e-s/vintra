import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../common/Button';

/**
 * Generic modal component for simple content display
 */
const GenericModal = ({ 
  title, 
  content, 
  confirmLabel = 'OK', 
  cancelLabel = 'Cancelar', 
  onConfirm, 
  onClose, 
  showCancel = true, 
  size = 'medium'
}) => {
  return (
    <ModalContainer size={size}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <CloseButton onClick={onClose}>
          <i className="fas fa-times"></i>
        </CloseButton>
      </ModalHeader>
      
      <ModalBody>
        {typeof content === 'string' ? <div dangerouslySetInnerHTML={{ __html: content }} /> : content}
      </ModalBody>
      
      <ModalFooter>
        {showCancel && (
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
        )}
        {onConfirm && (
          <Button 
            variant="primary" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        )}
      </ModalFooter>
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
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} var(--duration-lg) var(--ease-elastic) forwards;
  overflow: hidden;
  
  ${({ size }) => {
    switch(size) {
      case 'small':
        return 'max-width: 400px;';
      case 'large':
        return 'max-width: 800px;';
      case 'full':
        return 'max-width: 90%; height: 90vh;';
      case 'medium':
      default:
        return 'max-width: 600px;';
    }
  }}
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

const ModalFooter = styled.div`
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  position: relative;
  flex-shrink: 0;
  
  /* Top border */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: var(--space-6);
    right: var(--space-6);
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
    opacity: 0.4;
  }
`;

export default GenericModal;
