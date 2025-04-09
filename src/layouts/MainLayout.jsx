import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import MobileNavBar from '../components/common/MobileNavBar';
import HealthCheck from '../components/common/HealthCheck';

const MainLayout = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isMobile); // Em desktop é expandida por padrão
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile); // Visível por padrão em desktop, oculta em mobile
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Detecta mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Em mobile, sempre esconde a sidebar
      if (mobile) {
        setSidebarVisible(false);
        setIsSidebarExpanded(false);
      } else {
        setSidebarVisible(true);
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Configura o estado inicial
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarVisible]);
  
  // Monitora a seleção de paciente para a barra de navegação móvel
  useEffect(() => {
    const checkSelectedPatient = () => {
      const storedPatient = localStorage.getItem('vintra_selected_patient');
      if (storedPatient) {
        try {
          setSelectedPatient(JSON.parse(storedPatient));
        } catch (e) {
          setSelectedPatient(null);
        }
      } else {
        setSelectedPatient(null);
      }
    };
    
    // Verifica a seleção inicial de paciente
    checkSelectedPatient();
    
    // Configura uma verificação periodica
    const interval = setInterval(() => {
      const refresh = localStorage.getItem('vintra_sidebar_refresh');
      if (refresh) {
        checkSelectedPatient();
        localStorage.removeItem('vintra_sidebar_refresh');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible);
    } else {
      // Em desktop, alterna visibilidade da sidebar
      setSidebarVisible(!sidebarVisible);
      setIsSidebarExpanded(true); // Sempre expandida no desktop quando visível
    }
  };

  // Fecha a sidebar quando clica fora
  const handleContentClick = () => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  };

  return (
    <LayoutContainer>
      {/* Overlay para fechar a sidebar quando visível */}
      {sidebarVisible && (
        <SidebarOverlay onClick={() => setSidebarVisible(false)} />
      )}
      
      {/* Sidebar com props atualizadas */}
      <Sidebar 
        expanded={isSidebarExpanded}
        visible={sidebarVisible}
        isMobile={isMobile}
        onToggle={toggleSidebar}
      />
      
      <MainContentContainer 
        sidebarExpanded={isSidebarExpanded} 
        sidebarVisible={sidebarVisible} 
        isMobile={isMobile}
      >
        {/* Health check component to verify API connectivity */}
        <HealthCheck />
        
        <Header 
          user={currentUser} 
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />
        <ContentArea onClick={handleContentClick}>
          {children}
        </ContentArea>
        
        {/* Barra de navegação móvel - visível apenas em dispositivos móveis */}
        {isMobile && <MobileNavBar selectedPatient={selectedPatient} />}
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

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  animation: fadeIn 0.3s ease;
  touch-action: none; // Impede scroll no fundo quando overlay está ativo

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s var(--ease-out);
  width: 100%;
  margin-left: ${props => (props.sidebarVisible && !props.isMobile) ? '250px' : '0'};
  
  /* Efeito de transição fluido */
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0.9; }
    to { opacity: 1; }
  }
  
  /* Ajustes para mobile */
  @media (max-width: 768px) {
    margin-left: 0; /* Nunca aplica margem em mobile */
    width: 100%;
    overflow-x: hidden;
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
  
  /* Responsivo para mobile */
  @media (max-width: 768px) {
    padding: var(--space-2);
    padding-bottom: calc(var(--space-4) + 60px); /* Espaço extra no fim para evitar que o conteúdo fique atrás de menus fixos */
    -webkit-overflow-scrolling: touch; /* Melhor scroll em iOS */
  }
  
  /* Efeito de animação suave quando o conteúdo se ajusta */
  transition: all 0.3s var(--ease-gentle);
`;

export default MainLayout;
