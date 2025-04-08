import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference stored
  const savedTheme = localStorage.getItem('vintra_theme') || 'light';
  const [themeMode, setThemeMode] = useState(savedTheme);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // Set theme CSS variables on document.documentElement
    Object.entries(theme.colors).forEach(([name, value]) => {
      document.documentElement.style.setProperty(`--${name}`, value);
    });

    // Store theme preference
    localStorage.setItem('vintra_theme', themeMode);
  }, [themeMode, theme]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
