import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

/**
 * Card component for displaying patient information in lists
 */
const PatientCard = ({ patient, onSelect, isSelected = false }) => {
  const { id, name, age, gender, lastVisit, status } = patient;
  
  // Get the first letter of the name for the avatar
  const avatarLetter = name?.charAt(0) || 'P';
  
  return (
    <CardContainer isSelected={isSelected}>
      <CardHeader>
        <PatientAvatar isSelected={isSelected}>{avatarLetter}</PatientAvatar>
        <PatientDetails>
          <PatientName>{name}</PatientName>
          <PatientMeta>
            {age} years • {gender}
          </PatientMeta>
        </PatientDetails>
      </CardHeader>
      
      <CardInfo>
        <InfoItem>
          <InfoLabel>Record:</InfoLabel>
          <InfoValue>{id.replace('patient-', '')}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Last visit:</InfoLabel>
          <InfoValue>{lastVisit}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Status:</InfoLabel>
          <StatusBadge status={status}>{status}</StatusBadge>
        </InfoItem>
      </CardInfo>
      
      <Button 
        onClick={onSelect}
        variant={isSelected ? "secondary" : "primary"}
        fullWidth
      >
        {isSelected ? (
          <>
            <i className="fas fa-check"></i> Selected
          </>
        ) : (
          <>Select</>
        )}
      </Button>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.5)'}, 
    ${props => props.isSelected ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255, 255, 255, 0.2)'}
  );
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  border-radius: var(--radius-xl);
  transition: all var(--duration-lg) cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border: 1px solid ${props => props.isSelected ? 'var(--accent-light)' : 'transparent'};
  
  /* Shine effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s var(--ease-gentle);
  }
  
  /* Accent line effect */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.isSelected 
      ? 'var(--accent)' 
      : 'linear-gradient(to bottom, transparent, var(--accent-light), transparent)'};
    opacity: ${props => props.isSelected ? 1 : 0};
    transition: opacity 0.4s var(--ease-gentle), transform 0.6s var(--ease-out);
    transform: scaleY(${props => props.isSelected ? 1 : 0.5});
  }
  
  &:hover::before {
    transform: translateX(100%);
  }
  
  &:hover::after {
    opacity: 1;
    transform: scaleY(${props => props.isSelected ? 1 : 0.8});
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05), 0 5px 15px rgba(0, 0, 0, 0.025);
    background: linear-gradient(135deg, 
      ${props => props.isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.7)'}, 
      ${props => props.isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.4)'}
    );
    border-color: ${props => props.isSelected ? 'var(--accent)' : 'var(--accent-light)'};
  }
  
  &:active {
    transform: translateY(-1px) scale(0.99);
    transition-duration: 0.2s;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const PatientAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.isSelected ? 'var(--accent-vivid)' : 'var(--teal-900)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--text-on-dark);
  transition: all var(--duration-md) var(--ease-elastic);
  flex-shrink: 0;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const PatientDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

const PatientName = styled.div`
  font-weight: 600;
  margin-bottom: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  font-family: var(--font-heading);
`;

const PatientMeta = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
`;

const InfoLabel = styled.span`
  color: var(--text-tertiary);
`;

const InfoValue = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'Em tratamento':
        return `
          background-color: var(--teal-100);
          color: var(--teal-800);
        `;
      case 'Primeira consulta':
        return `
          background-color: var(--success-subtle);
          color: var(--success-vivid);
        `;
      case 'Retorno':
        return `
          background-color: var(--warning-subtle);
          color: var(--warning-vivid);
        `;
      default:
        return `
          background-color: var(--gray-200);
          color: var(--text-secondary);
        `;
    }
  }}
`;

export default PatientCard;
