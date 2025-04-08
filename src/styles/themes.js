/**
 * Theme definitions for light and dark modes
 */

// Light theme (default)
export const lightTheme = {
  colors: {
    // Surface colors
    'surface-white': 'rgba(255, 255, 255, 1)',
    'surface-hover': 'rgba(245, 245, 250, 0.7)',
    'surface-background': 'rgba(250, 250, 252, 1)',
    'surface-raised': 'rgba(255, 255, 255, 0.6)',
    'surface-overlay': 'rgba(255, 255, 255, 0.85)',
    'surface-card': 'rgba(255, 255, 255, 0.7)',
    'surface-modal': 'rgba(255, 255, 255, 0.9)',
    
    // Text colors
    'text-primary': 'rgba(34, 35, 42, 0.95)',
    'text-secondary': 'rgba(85, 88, 105, 0.9)',
    'text-tertiary': 'rgba(119, 123, 146, 0.8)',
    'text-disabled': 'rgba(119, 123, 146, 0.5)',
    'text-on-accent': 'rgba(255, 255, 255, 0.95)',
    'text-on-dark': 'rgba(255, 255, 255, 0.95)',
    
    // Border colors
    'border-color': 'rgba(236, 237, 242, 1)',
    'border-color-light': 'rgba(209, 211, 222, 0.3)',
    
    // Gradient backgrounds
    'gradient-subtle-gray': 'linear-gradient(120deg, rgba(250, 250, 252, 1), rgba(245, 245, 250, 1))',
    'gradient-glass': 'linear-gradient(120deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
    'gradient-light-accent': 'linear-gradient(120deg, rgba(6, 182, 212, 0.04), rgba(6, 182, 212, 0.01))',
  }
};

// Dark theme
export const darkTheme = {
  colors: {
    // Surface colors
    'surface-white': 'rgba(30, 32, 40, 1)',
    'surface-hover': 'rgba(40, 42, 50, 0.7)',
    'surface-background': 'rgba(20, 22, 30, 1)',
    'surface-raised': 'rgba(40, 42, 50, 0.6)',
    'surface-overlay': 'rgba(30, 32, 40, 0.85)',
    'surface-card': 'rgba(40, 42, 50, 0.7)',
    'surface-modal': 'rgba(30, 32, 40, 0.9)',
    
    // Text colors
    'text-primary': 'rgba(240, 240, 245, 0.95)',
    'text-secondary': 'rgba(200, 200, 210, 0.9)',
    'text-tertiary': 'rgba(170, 170, 180, 0.8)',
    'text-disabled': 'rgba(140, 140, 150, 0.5)',
    'text-on-accent': 'rgba(255, 255, 255, 0.95)',
    'text-on-dark': 'rgba(255, 255, 255, 0.95)',
    
    // Border colors
    'border-color': 'rgba(50, 52, 60, 1)',
    'border-color-light': 'rgba(60, 62, 70, 0.3)',
    
    // Gradient backgrounds
    'gradient-subtle-gray': 'linear-gradient(120deg, rgba(25, 27, 35, 1), rgba(30, 32, 40, 1))',
    'gradient-glass': 'linear-gradient(120deg, rgba(40, 42, 50, 0.6), rgba(40, 42, 50, 0.3))',
    'gradient-light-accent': 'linear-gradient(120deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.04))',
  }
};
