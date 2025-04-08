import { vintraApi } from '../../services/api';

export const processConsultationAudio = async (audioBlob, options = {}) => {
  try {
    // Upload do áudio
    const uploadResponse = await vintraApi.uploadAudio(audioBlob, {
      diarization: options.diarization ?? true
    });

    const { consultationId } = uploadResponse;

    // Se autoProcess está habilitado, inicia o processamento
    if (options.autoProcess) {
      await vintraApi.processAudio(consultationId, {
        generateDocuments: true,
        ...options
      });
    }

    return { consultationId };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw new Error(error.response?.data?.message || 'Falha ao processar o áudio');
  }
};