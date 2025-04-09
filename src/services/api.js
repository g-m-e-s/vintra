import axios from 'axios';

// Instância do axios com configurações base
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tratamento de erros
const handleAPIError = (error) => {
  if (error.response) {
    // Erro com resposta do servidor
    const message = error.response.data?.error || 'Erro no servidor';
    const details = error.response.data?.details;
    throw new Error(details ? `${message}: ${JSON.stringify(details)}` : message);
  } else if (error.request) {
    // Erro sem resposta do servidor
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  } else {
    // Erro na configuração da requisição
    throw new Error('Erro ao preparar requisição: ' + error.message);
  }
};

export const vintraApi = {
  // Authentication
  login: async (password) => {
    try {
      // For development/demo purposes, using a hardcoded password
      // In production, this should call a secure API endpoint
      if (password === "vintra2025") {
        return {
          user: {
            name: "VINTRA User",
            role: "admin"
          },
          token: "demo-token-" + Date.now()
        };
      }
      throw new Error("Invalid credentials");
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Upload e processamento de áudio
  uploadAudio: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const response = await api.post('/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-processing-options': JSON.stringify(options)
        }
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Processamento de documentos
  processDocument: async (transcription, documentType) => {
    try {
      const response = await api.post('/process', {
        transcription,
        documentType
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Acompanhamento de status
  getProcessingStatus: async (consultationId) => {
    try {
      const response = await api.get(`/status/${consultationId}`);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Obtenção de resultados
  getDocuments: async (consultationId) => {
    try {
      const response = await api.get(`/documents/${consultationId}`);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  getTranscription: async (consultationId) => {
    try {
      const response = await api.get(`/transcription/${consultationId}`);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Análise dimensional
  getDimensionalAnalysis: async (consultationId) => {
    try {
      const response = await api.get(`/analysis/${consultationId}/dimensional`);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  },

  // Verificação de status do serviço
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data.status === 'ok';
    } catch (error) {
      return false;
    }
  }
};