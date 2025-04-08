import { APIError } from './_utils';
import formidable from 'formidable';
import { createReadStream } from 'fs';

export const validateAudioFile = async (file) => {
  const maxSize = parseInt(process.env.MAX_AUDIO_SIZE || '30') * 1024 * 1024; // MB to bytes
  
  if (!file) {
    throw new APIError('No audio file provided', 400);
  }

  if (file.size > maxSize) {
    throw new APIError('Audio file too large', 400, {
      maxSize: `${process.env.MAX_AUDIO_SIZE}MB`,
      receivedSize: `${Math.round(file.size / (1024 * 1024))}MB`
    });
  }

  const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/webm'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new APIError('Invalid audio format', 400, {
      allowedTypes,
      receivedType: file.mimetype
    });
  }

  return createReadStream(file.filepath);
};

export const parseFormData = (req) => {
  const form = formidable({
    maxFileSize: parseInt(process.env.MAX_AUDIO_SIZE || '30') * 1024 * 1024
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(new APIError('Error parsing form data', 400, { details: err.message }));
        return;
      }

      resolve({
        fields,
        files: files.audio?.[0]
      });
    });
  });
};