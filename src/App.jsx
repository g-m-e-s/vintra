import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useUI } from './hooks/useUI';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Library from './pages/Library';
import NewConsultation from './pages/NewConsultation';
import Documentation from './pages/Documentation';
import Processing from './pages/Processing';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

// Components
import Toast from './components/common/Toast';
import ModalContainer from './components/modals/ModalContainer';

const App = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toasts, showToast } = useUI();
  const [appError, setAppError] = useState(null);

  // Global error boundary
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global error:', event.error);
      setAppError(event.error?.message || 'An unexpected error occurred');
      showToast({
        type: 'error',
        message: 'An error occurred. Please try refreshing the page.',
        duration: 10000
      });
      // Prevent the default error handler
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    
    // Check API connectivity
    const checkApiConnectivity = async () => {
      try {
        // We import here to avoid circular dependencies
        const { vintraApi } = await import('./services/api');
        const isHealthy = await vintraApi.checkHealth();
        console.log('API Health Check:', isHealthy ? 'OK' : 'Failed');
        
        if (!isHealthy) {
          showToast({
            type: 'warning',
            message: 'API connection issues detected. Some features may not work properly.',
            duration: 8000
          });
        }
      } catch (error) {
        console.error('API connectivity check failed:', error);
      }
    };
    
    checkApiConnectivity();

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [showToast]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (authLoading) return <div>Carregando...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      {/* Global UI Elements */}
      <Toast />
      <ModalContainer />
      
      {/* Error display */}
      {appError && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#f44336',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          zIndex: 9999,
          maxWidth: '80%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <h4>Application Error</h4>
          <p>{appError}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'white',
              color: '#f44336',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload App
          </button>
        </div>
      )}

      {/* Routes */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/patients" element={
          <ProtectedRoute>
            <MainLayout>
              <Patients />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/patients/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <PatientDetail />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/library" element={
          <ProtectedRoute>
            <MainLayout>
              <Library />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/new-consultation" element={
          <ProtectedRoute>
            <MainLayout>
              <NewConsultation />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/documentation" element={
          <ProtectedRoute>
            <MainLayout>
              <Documentation />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/processing" element={
          <ProtectedRoute>
            <MainLayout>
              <Processing />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/results" element={
          <ProtectedRoute>
            <MainLayout>
              <Results />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
