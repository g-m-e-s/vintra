import os
from google.cloud import storage
import tempfile

class StorageService:
    def __init__(self):
        # Verificar se estamos em modo de emulação (desenvolvimento)
        self.emulation_mode = os.getenv("LOCAL_DEVELOPMENT") == "true"
        
        if not self.emulation_mode:
            # Modo real - usar Google Cloud Storage
            self.project_id = os.getenv("GCP_PROJECT_ID")
            self.bucket_name = os.getenv("STORAGE_BUCKET_NAME", "vintra-storage")
            self.client = storage.Client(project=self.project_id)
            self.bucket = self.client.bucket(self.bucket_name)
        else:
            # Modo emulação - criar diretório temporário
            self.temp_dir = os.path.join(tempfile.gettempdir(), "vintra-storage")
            os.makedirs(self.temp_dir, exist_ok=True)
    
    async def upload_file(self, file_content, destination_blob_name):
        """
        Uploads a file to the storage bucket
        
        Args:
            file_content: The file content to upload
            destination_blob_name: The name to give the file in the bucket
            
        Returns:
            str: The public URL of the uploaded file
        """
        if self.emulation_mode:
            # Modo emulação - salvar em diretório temporário
            file_path = os.path.join(self.temp_dir, destination_blob_name)
            
            # Criar diretório se não existir
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # Salvar arquivo
            with open(file_path, "wb") as f:
                if isinstance(file_content, str):
                    f.write(file_content.encode("utf-8"))
                else:
                    f.write(file_content)
            
            return f"file://{file_path}"
        else:
            # Modo real - usar Google Cloud Storage
            blob = self.bucket.blob(destination_blob_name)
            
            if isinstance(file_content, str):
                blob.upload_from_string(file_content)
            else:
                blob.upload_from_string(file_content, content_type="application/octet-stream")
            
            return blob.public_url
    
    async def download_file(self, source_blob_name):
        """
        Downloads a file from the storage bucket
        
        Args:
            source_blob_name: The name of the file in the bucket
            
        Returns:
            bytes: The file content
        """
        if self.emulation_mode:
            # Modo emulação - ler do diretório temporário
            file_path = os.path.join(self.temp_dir, source_blob_name)
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File {source_blob_name} not found in local storage")
                
            with open(file_path, "rb") as f:
                return f.read()
        else:
            # Modo real - usar Google Cloud Storage
            blob = self.bucket.blob(source_blob_name)
            return blob.download_as_bytes()