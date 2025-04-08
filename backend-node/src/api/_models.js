import { pipeline } from '@xenova/transformers';

// Cache global para os modelos
let whisperModel = null;

// Inicialização otimizada do Whisper
export const getWhisperModel = async () => {
  if (!whisperModel) {
    whisperModel = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small', {
      quantized: true, // Usar versão quantizada para menor uso de memória
      cache_dir: '/tmp/whisper-cache', // Cache em pasta temporária na Vercel
    });
  }
  return whisperModel;
};