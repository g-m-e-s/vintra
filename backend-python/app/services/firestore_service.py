from google.cloud import firestore
import datetime
import json
import os

class FirestoreService:
    def __init__(self):
        # Verificar se estamos em modo de emulação (desenvolvimento)
        self.emulation_mode = os.getenv("FIRESTORE_EMULATOR_HOST") is not None
        
        if self.emulation_mode:
            # Usar simulação em memória para desenvolvimento
            self.client = None
            self.memory_db = {
                "pacientes": {},
                "sessoes": {},
                "analises_vintra": {}
            }
        else:
            # Usar cliente Firestore real
            self.client = firestore.Client()
    
    async def create_patient(self, patient_data):
        """
        Cria um documento de paciente no Firestore
        
        Args:
            patient_data: Dados do paciente
            
        Returns:
            str: ID do paciente criado
        """
        # Adicionar timestamp
        patient_data["data_criacao"] = datetime.datetime.now()
        
        if self.emulation_mode:
            # Modo de emulação - usar armazenamento em memória
            patient_id = f"patient_{len(self.memory_db['pacientes']) + 1}"
            self.memory_db["pacientes"][patient_id] = patient_data
            return patient_id
        else:
            # Modo real - usar Firestore
            doc_ref = self.client.collection("pacientes").document()
            doc_ref.set(patient_data)
            return doc_ref.id
    
    async def get_patient(self, patient_id):
        """
        Recupera um paciente pelo ID
        
        Args:
            patient_id: ID do paciente
            
        Returns:
            dict: Dados do paciente
        """
        if self.emulation_mode:
            # Modo de emulação
            return self.memory_db["pacientes"].get(patient_id)
        else:
            # Modo real
            doc_ref = self.client.collection("pacientes").document(patient_id)
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            return None
    
    async def create_session(self, patient_id, session_data):
        """
        Cria uma sessão para um paciente
        
        Args:
            patient_id: ID do paciente
            session_data: Dados da sessão
            
        Returns:
            str: ID da sessão criada
        """
        # Adicionar timestamp e referência ao paciente
        session_data["data"] = datetime.datetime.now()
        session_data["paciente_id"] = patient_id
        
        if self.emulation_mode:
            # Modo de emulação
            session_id = f"session_{len(self.memory_db['sessoes']) + 1}"
            self.memory_db["sessoes"][session_id] = session_data
            return session_id
        else:
            # Modo real
            doc_ref = self.client.collection("sessoes").document()
            doc_ref.set(session_data)
            return doc_ref.id
    
    async def store_dimensional_analysis(self, session_id, analysis_data):
        """
        Armazena análise dimensional VINTRA
        
        Args:
            session_id: ID da sessão
            analysis_data: Dados da análise dimensional
            
        Returns:
            str: ID da análise
        """
        # Adicionar timestamp e referência à sessão
        if isinstance(analysis_data.get("data_criacao"), datetime.datetime):
            # Já tem data
            pass
        else:
            analysis_data["data_criacao"] = datetime.datetime.now()
            
        analysis_data["sessao_id"] = session_id
        
        # Processar dados para armazenamento (lidar com valores não serializáveis)
        clean_data = self._prepare_for_storage(analysis_data)
        
        if self.emulation_mode:
            # Modo de emulação
            analysis_id = f"analysis_{len(self.memory_db['analises_vintra']) + 1}"
            self.memory_db["analises_vintra"][analysis_id] = clean_data
            return analysis_id
        else:
            # Modo real
            doc_ref = self.client.collection("analises_vintra").document()
            doc_ref.set(clean_data)
            return doc_ref.id
    
    def _prepare_for_storage(self, data):
        """Prepara dados para armazenamento no Firestore"""
        # Clone para não modificar o original
        result = {}
        
        for key, value in data.items():
            # Converter datetime para string ISO
            if isinstance(value, datetime.datetime):
                result[key] = value.isoformat()
            # Converter objetos complexos para JSON
            elif not isinstance(value, (str, int, float, bool, list, dict, type(None))):
                result[key] = json.dumps(str(value))
            # Processo recursivo para dicionários aninhados
            elif isinstance(value, dict):
                result[key] = self._prepare_for_storage(value)
            # Processo recursivo para listas
            elif isinstance(value, list):
                result[key] = [
                    self._prepare_for_storage(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                result[key] = value
                
        return result