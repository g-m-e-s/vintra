/**
 * Auth Service
 * In a real application, this would make API calls to a backend server.
 * For the demo version, we're simulating authentication.
 */

// Mock credentials for demo
const DEMO_PASSWORD = '123'; // Keeping same as original for demo
const DEMO_USER = {
  id: 'user-1',
  name: 'Demonstração',
  role: 'clinician',
  avatar: 'D'
};

export const authService = {
  /**
   * Simulated login function
   * @param {string} password - User password
   * @returns {Promise<Object|null>} - User data or null if login fails
   */
  login: async (password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === DEMO_PASSWORD) {
          resolve(DEMO_USER);
        } else {
          reject(new Error('Senha incorreta. Por favor, tente novamente.'));
        }
      }, 800); // Simulate network delay
    });
  },

  /**
   * Verify auth token validity (simulated)
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} - Token validity
   */
  verifyToken: async (token) => {
    // In a real app, this would validate the token with the server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(!!token); // Simply check if token exists for demo
      }, 300);
    });
  },

  /**
   * Get current user info (simulated)
   * @returns {Promise<Object|null>} - User data or null if not logged in
   */
  getCurrentUser: async () => {
    // In a real app, this would make an API call with the stored token
    const storedUser = localStorage.getItem('vintra_user');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(storedUser ? JSON.parse(storedUser) : null);
      }, 300);
    });
  }
};
