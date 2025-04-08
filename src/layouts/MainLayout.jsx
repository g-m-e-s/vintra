import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const MainLayout = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // Em desktop, a sidebar sempre permanece expandida
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isMobile);

  // Detecta quando estamos em modo mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Em desktop, sempre mantém expandido
      if (!mobile && !isSidebarExpanded) {
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarExpanded]);

  // Toggle sidebar expansion (apenas funciona em mobile)
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  return (
    <LayoutContainer>
      <Sidebar 
        expanded={isSidebarExpanded}
        onToggle={toggleSidebar}
      />
      <MainContentContainer>
        <Header 
          user={currentUser} 
          onMenuClick={toggleSidebar}
        />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContentContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  margin-left: 250px; /* Espaço para a sidebar fixa em desktop */
  width: 100%;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 90%; /* Área de visualização de 90% no mobile */
    margin: 0 auto; /* Centraliza o conteúdo */
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: var(--surface-background);
  position: relative;
  padding: var(--space-4);
  
  /* Adiciona uma borda suave para separação visual */
  border-top: 1px solid var(--border-color-light);
  
  @media (max-width: 768px) {
    padding: var(--space-3);
  }
`;

export default MainLayout;
