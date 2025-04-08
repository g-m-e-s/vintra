import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useUI } from '../../hooks/useUI';

/**
 * Toast notification component
 * Displays notifications at the bottom right of the screen
 */
const Toast = () => {
  const { toasts, removeToast } = useUI();

  // Auto remove toasts when their time is up
  useEffect(() => {
    // For each toast with a duration > 0, set up a timer to remove it
    toasts.forEach(toast => {
      if (toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);

        // Clean up the timer when component unmounts or toast is removed
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          type={toast.type}
          onAnimationEnd={(e) => {
            if (e.animationName.includes('exit')) {
              removeToast(toast.id);
            }
          }}
        >
          <ToastIcon type={toast.type}>
            {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
            {toast.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
          </ToastIcon>
          
          <ToastContent>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
          </ToastContent>
          
          <ToastClose onClick={() => removeToast(toast.id)}>
            <i className="fas fa-times"></i>
          </ToastClose>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

const toastEnter = keyframes`
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const toastExit = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(20px);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 1050; /* Above modals */
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 350px;
  width: 90%;
  pointer-events: none;
`;

const ToastItem = styled.div`
  display: flex;
  align-items: flex-start;
  background: var(--surface-white);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-lg);
  animation: ${toastEnter} var(--duration-md) var(--ease-bounce) forwards;
  pointer-events: auto;
  gap: var(--space-3);
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return css`border-left: 4px solid var(--success);`;
      case 'error':
        return css`border-left: 4px solid var(--error);`;
      case 'warning':
        return css`border-left: 4px solid var(--warning);`;
      case 'info':
      default:
        return css`border-left: 4px solid var(--accent);`;
    }
  }}
  
  &.exit {
    animation: ${toastExit} var(--duration-md) var(--ease-out) forwards;
  }
`;

const ToastIcon = styled.div`
  font-size: 1.25rem;
  margin-top: 2px;
  flex-shrink: 0;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return css`color: var(--success);`;
      case 'error':
        return css`color: var(--error);`;
      case 'warning':
        return css`color: var(--warning);`;
      case 'info':
      default:
        return css`color: var(--accent);`;
    }
  }}
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
`;

const ToastMessage = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: var(--space-1);
  margin-left: var(--space-2);
  margin-top: -4px;
  margin-right: -8px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--gray-100);
  }
`;

export default Toast;
