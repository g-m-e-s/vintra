import React, { useEffect } from 'react';
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
  const { toasts } = useUI();

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
