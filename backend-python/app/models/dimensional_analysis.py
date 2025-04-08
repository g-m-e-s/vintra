from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class DimensionalAnalysis(BaseModel):
    sessao_id: str
    
    # Dimensões Emocionais
    v1: float = Field(..., description="Valência Emocional", ge=-5, le=5)
    v2: float = Field(..., description="Excitação Emocional", ge=0, le=10)
    v3: float = Field(..., description="Dominância Emocional", ge=0, le=10)
    v4: float = Field(..., description="Intensidade Afetiva", ge=0, le=10)
    
    # Dimensões Cognitivas
    v5: float = Field(..., description="Complexidade Sintática", ge=0, le=10)
    v6: float = Field(..., description="Coerência Narrativa", ge=0, le=10)
    v7: float = Field(..., description="Flexibilidade Cognitiva", ge=0, le=10)
    v8: float = Field(..., description="Dissonância Cognitiva", ge=0, le=10)
    
    # Dimensões de Autonomia
    v9_past: float = Field(..., description="Perspectiva Temporal - Passado", ge=0, le=10)
    v9_present: float = Field(..., description="Perspectiva Temporal - Presente", ge=0, le=10)
    v9_future: float = Field(..., description="Perspectiva Temporal - Futuro", ge=0, le=10)
    v10: float = Field(..., description="Autocontrole", ge=0, le=10)
    
    # Elementos textuais
    sintese_narrativa: str
    formulacao_integrativa: str
    recomendacoes: List[str]
    
    # Análise de trajetória
    trajetoria: Optional[Dict[str, float]] = None
    
    # Metadados
    data_criacao: Optional[datetime] = None
    raw_response: Optional[str] = None