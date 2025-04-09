import React, { useEffect, useState } from 'react';
import { vintraApi } from '../../services/api';
import { useUI } from '../../hooks/useUI';

/**
 * HealthCheck - Component that checks if backend services are available
 * and displays appropriate notifications if they are not.
 */
const HealthCheck = () => {
  const [health, setHealth] = useState({
    checked: false,
    status: 'pending',
    services: {}
  });
  const { showToast } = useUI();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await vintraApi.checkHealth();
        console.log('Health check result:', result);
        
        if (typeof result === 'object') {
          setHealth({
            checked: true,
            status: result.status || 'ok',
            services: result.services || {}
          });
          
          // If any services are down, show a notification
          if (result.status === 'degraded') {
            const downServices = Object.entries(result.services || {})
              .filter(([_, status]) => !status)
              .map(([name]) => name)
              .join(', ');
              
            showToast({
              type: 'warning',
              message: `Some services are currently unavailable: ${downServices}. Functionality may be limited.`,
              duration: 10000
            });
          }
        } else if (result === false) {
          setHealth({
            checked: true,
            status: 'down',
            services: {}
          });
          
          showToast({
            type: 'error',
            message: 'Backend services are currently unavailable. Please try again later.',
            duration: 10000
          });
        } else {
          // If we got a truthy result but not an object, assume things are ok
          setHealth({
            checked: true,
            status: 'ok',
            services: {}
          });
        }
      } catch (error) {
        console.error('Error checking health:', error);
        setHealth({
          checked: true,
          status: 'error',
          services: {}
        });
        
        showToast({
          type: 'error',
          message: 'Unable to connect to backend services. Please check your connection.',
          duration: 10000
        });
      }
    };

    checkHealth();
    
    // Schedule periodic health checks every 5 minutes
    const intervalId = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [showToast]);

  // This component doesn't render anything visible
  return null;
};

export default HealthCheck;
