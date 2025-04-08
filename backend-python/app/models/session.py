from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class SessionCreate(BaseModel):
    queixa_principal: str
    medicacoes_atuais: Optional[List[str]] = None
    notas: Optional[str] = None
    contexto: Optional[Dict[str, str]] = None

class Session(BaseModel):
    id: str
    paciente_id: str
    data: datetime
    queixa_principal: str
    medicacoes_atuais: Optional[List[str]] = None
    notas: Optional[str] = None
    contexto: Optional[Dict[str, str]] = None