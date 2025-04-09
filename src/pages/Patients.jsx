import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import PatientCard from '../components/patients/PatientCard';
import { useUI } from '../hooks/useUI';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { showSuccess } = useUI();
  const navigate = useNavigate();

  // Check for stored selected patient
  useEffect(() => {
    const storedPatient = localStorage.getItem('vintra_selected_patient');
    if (storedPatient) {
      try {
        setSelectedPatient(JSON.parse(storedPatient));
      } catch (e) {
        localStorage.removeItem('vintra_selected_patient');
      }
    }
  }, []);

  // Load patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real app
        // For demo purposes, we'll use mock data
        const mockPatients = [
          { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Female', lastVisit: '03/28/2025', status: 'In Treatment' },
          { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Male', lastVisit: '03/25/2025', status: 'First Visit' },
          { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Female', lastVisit: '03/20/2025', status: 'In Treatment' },
          { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Male', lastVisit: '03/15/2025', status: 'Follow-up' }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setPatients(mockPatients);
          setFilteredPatients(mockPatients);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(normalizedSearch) || 
      patient.id.toLowerCase().includes(normalizedSearch)
    );
    
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Handler for patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('vintra_selected_patient', JSON.stringify(patient));
    showSuccess('Patient Selected', `${patient.name} has been selected successfully. All functionalities are now available.`);
    
    // Force refresh of sidebar by updating a localStorage timestamp
    localStorage.setItem('vintra_sidebar_refresh', Date.now().toString());
    
    // Navigate to dashboard to see all features
    navigate('/');
  };
  return (
    <PatientsContainer>
      <PageHeader>
        <PageTitle>Patients</PageTitle>
        <PageSubtitle>Manage your patient list and select a patient to work with.</PageSubtitle>
      </PageHeader>
      
      <SearchContainer>
        <SearchBar>
        <SearchIcon className="fas fa-search" />
        <SearchInput
        type="text"
        placeholder="Search for patients by name or ID..."
          value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>
      </SearchContainer>
      
      {loading ? (
        <LoadingContainer>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading patients...</p>
        </LoadingContainer>
      ) : filteredPatients.length === 0 ? (
        <EmptyState>
          <i className="fas fa-user-slash"></i>
          <p>No patients found matching your search.</p>
          <Button onClick={() => setSearchTerm('')} variant="secondary">
            Clear search
          </Button>
        </EmptyState>
      ) : (
        <PatientGrid>
          {filteredPatients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onSelect={() => handlePatientSelect(patient)}
              isSelected={selectedPatient?.id === patient.id}
            />
          ))}
        </PatientGrid>
      )}
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

const PatientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
  padding: var(--space-2);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    margin-bottom: var(--space-4);
  }
  
  p {
    font-size: 1.1rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
  color: var(--text-secondary);
  
  i {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }
  
  p {
    margin-bottom: var(--space-4);
    font-size: 1.1rem;
  }
`;

export default Patients;
