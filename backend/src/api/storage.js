import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// Diretório temporário para uploads
const TEMP_DIR = join(tmpdir(), 'vintra-uploads');

export const storeAudioFile = async (buffer) => {
  const fileName = `${uuidv4()}.webm`;
  const filePath = join(TEMP_DIR, fileName);
  
  try {
    await writeFile(filePath, buffer);
    return {
      path: filePath,
      name: fileName
    };
  } catch (error) {
    console.error('Error storing audio file:', error);
    throw new Error('Failed to store audio file');
  }
};

export const deleteAudioFile = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting audio file:', error);
  }
};