import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Patients = () => {
  return (
    <PatientsContainer>
      <PageHeader>
        <PageTitle>Pacientes</PageTitle>
        <PageSubtitle>Gerencie a lista de seus pacientes.</PageSubtitle>
      </PageHeader>
      
      <SearchContainer>
        <SearchBar>
          <SearchIcon className="fas fa-search" />
          <SearchInput
            type="text"
            placeholder="Buscar paciente por nome ou ID..."
          />
        </SearchBar>
      </SearchContainer>
      
      <ContentPlaceholder>
        <i className="fas fa-users"></i>
        <p>Lista de pacientes será carregada aqui.</p>
        <p>Implementação completa em desenvolvimento.</p>
      </ContentPlaceholder>
    </PatientsContainer>
  );
};

const PatientsContainer = styled.div`
  padding: var(--space-6);
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-8);
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const PageSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const SearchContainer = styled.div`
  margin-bottom: var(--space-6);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-md) var(--ease-gentle);
  border: 1px solid var(--border-color);
  max-width: 500px;
  
  &:focus-within {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-md);
    border-color: var(--teal-300);
  }
`;

const SearchIcon = styled.i`
  color: var(--text-tertiary);
  margin-right: var(--space-2);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: var(--text-primary);
  padding: var(--space-2) 0;
  
  &:focus {
    outline: none;
  }
`;

const ContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
  color: var(--text-tertiary);
  
  i {
    font-size: 4rem;
    margin-bottom: var(--space-4);
    opacity: 0.3;
  }
  
  p {
    margin-bottom: var(--space-2);
    font-size: 1.1rem;
  }
`;

export default Patients;
