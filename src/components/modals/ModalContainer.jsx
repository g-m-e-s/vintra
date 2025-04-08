import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useUI } from '../../hooks/useUI';

// Import modal components
import GenericModal from './GenericModal';
import DimensionalModal from './DimensionalModal';
import DocumentEditModal from './DocumentEditModal';

/**
 * Modal container and router
 * Renders the appropriate modal based on the modal state
 */
const ModalContainer = () => {
  const { modal, closeModal } = useUI();
  
  if (!modal.isOpen) return null;
  
  // Modal component mapping
  const ModalComponent = getModalComponent(modal.type);
  
  // If no matching modal type is found
  if (!ModalComponent) {
    console.error(`Modal type '${modal.type}' not found`);
    return null;
  }
  
  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalComponent {...modal.props} onClose={closeModal} />
    </ModalOverlay>
  );
  
  // Helper to handle clicks on the overlay (close modal only if clicked directly on overlay)
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }
  
  // Helper to get the correct modal component based on type
  function getModalComponent(type) {
    switch (type) {
      case 'generic':
        return GenericModal;
      case 'dimensional':
        return DimensionalModal;
      case 'documentEdit':
        return DocumentEditModal;
      default:
        return null;
    }
  }
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(34, 35, 42, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} var(--duration-md) var(--ease-gentle) forwards;
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
`;

export default ModalContainer;
