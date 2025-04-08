import { vintraApi } from './api';

/**
 * Auth Service
 * In a real application, this would make API calls to a backend server.
 */

export const authService = {
  /**
   * Login function using real API
   * @param {string} password - User password
   * @returns {Promise<Object|null>} - User data or null if login fails
   */
  login: async (password) => {
    try {
      const response = await vintraApi.login(password);
      const { user, token } = response;
      localStorage.setItem('vintra_token', token);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Falha na autenticação');
    }
  },

  /**
   * Verify auth token validity using real API
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} - Token validity
   */
  verifyToken: async (token) => {
    try {
      await vintraApi.login({ token }); // Verifica se o token é válido
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get current user info using real API
   * @returns {Promise<Object|null>} - User data or null if not logged in
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('vintra_token');
    if (!token) return null;

    try {
      const storedUser = localStorage.getItem('vintra_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch {
      return null;
    }
  }
};
