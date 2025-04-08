from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import date, datetime

class PatientCreate(BaseModel):
    nome: str
    data_nascimento: date
    genero: Optional[str] = None
    contato: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None

class Patient(BaseModel):
    id: str
    nome: str
    data_nascimento: date
    data_criacao: datetime
    genero: Optional[str] = None
    contato: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None