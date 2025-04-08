import React from 'react';
import styled, { css } from 'styled-components';

/**
 * Button component with multiple variants and sizes
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-weight: 500;
  border-radius: var(--radius-xl);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--duration-md) var(--ease-out);
  border: none;
  position: relative;
  overflow: hidden;
  user-select: none;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  opacity: ${props => props.disabled ? 0.5 : 1};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Shine effect on hover */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: left 0.7s var(--ease-gentle);
  }
  
  &:hover:not(:disabled):before {
    left: 100%;
  }
  
  /* Size Variants */
  ${props => props.size === 'small' && css`
    padding: var(--space-1) var(--space-3);
    font-size: 0.75rem;
  `}
  
  ${props => props.size === 'medium' && css`
    padding: var(--space-3) var(--space-6);
    font-size: 0.9375rem;
  `}
  
  ${props => props.size === 'large' && css`
    padding: var(--space-4) var(--space-8);
    font-size: 1rem;
  `}
  
  /* Button Variants */
  ${props => props.variant === 'primary' && css`
    background: var(--gradient-teal-dark);
    color: var(--text-on-accent);
    position: relative;
    z-index: 1;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.2), 0 3px 6px -3px rgba(0, 0, 0, 0.1);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0px) scale(0.98);
      box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }
    
    /* Radial gradient effect */
    &:after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%);
      transition: opacity 0.5s var(--ease-gentle);
      z-index: -1;
    }
    
    &:hover:not(:disabled):after {
      opacity: 1;
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(245, 245, 250, 0.6));
    color: var(--text-primary);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid var(--border-color);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 250, 0.7));
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 15px -8px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border-color: var(--gray-300);
      color: var(--text-primary);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0px) scale(0.98);
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background: transparent;
    color: var(--accent);
    border: 1px solid var(--accent);
    box-shadow: none;
    
    &:hover:not(:disabled) {
      background: var(--accent-subtle);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0px) scale(0.98);
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background: transparent;
    color: var(--accent);
    box-shadow: none;
    padding-left: var(--space-2);
    padding-right: var(--space-2);
    
    &:hover:not(:disabled) {
      background: var(--accent-subtle);
      transform: translateY(-1px);
    }
    
    &:before {
      display: none;
    }
  `}
  
  ${props => props.variant === 'danger' && css`
    background: linear-gradient(135deg, var(--error), var(--error-vivid));
    color: var(--text-on-accent);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 15px -8px rgba(239, 68, 68, 0.3), 0 2px 4px -2px rgba(239, 68, 68, 0.1);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0px) scale(0.98);
    }
  `}
  
  &:disabled {
    background-image: none;
    background-color: var(--gray-200);
    color: var(--text-disabled);
    border-color: var(--gray-300);
    box-shadow: none;
    cursor: not-allowed;
    transform: none !important;
    
    &:before, &:after {
      display: none;
    }
  }
`;

export default Button;
