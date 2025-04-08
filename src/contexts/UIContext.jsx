import React, { createContext, useState, useCallback } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: null, props: {} });
  const [isLoading, setIsLoading] = useState(false);

  // Toast functions
  const showToast = useCallback((type, title, message, duration = 5000) => {
    const id = Date.now();
    const newToast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Modal functions
  const openModal = useCallback((type, props = {}) => {
    setModal({ isOpen: true, type, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null, props: {} });
  }, []);

  // Loading state functions
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Utility functions for common patterns
  const showSuccess = useCallback((title, message) => {
    return showToast('success', title, message);
  }, [showToast]);

  const showError = useCallback((title, message) => {
    return showToast('error', title, message);
  }, [showToast]);

  const showWarning = useCallback((title, message) => {
    return showToast('warning', title, message);
  }, [showToast]);

  const showInfo = useCallback((title, message) => {
    return showToast('info', title, message);
  }, [showToast]);

  const value = {
    // Toast state and functions
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Modal state and functions
    modal,
    openModal,
    closeModal,
    
    // Loading state and functions
    isLoading,
    startLoading,
    stopLoading
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
