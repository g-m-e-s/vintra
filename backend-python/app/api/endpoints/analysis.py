from fastapi import APIRouter, Depends, HTTPException, Body, Form
from typing import Dict, Optional
from pydantic import BaseModel

from app.services.claude_service import ClaudeService
from app.services.firestore_service import FirestoreService
from app.services.graph.neo4j_service import Neo4jService
from app.services.vector.vertex_vector_service import VertexVectorService
from app.models.dimensional_analysis import DimensionalAnalysis

router = APIRouter()

# Modelos
class AnalysisRequest(BaseModel):
    transcricao: str
    contexto_paciente: Optional[str] = None
    sessao_id: Optional[str] = None

# Dependências
def get_claude_service():
    return ClaudeService()

def get_firestore_service():
    return FirestoreService()

def get_neo4j_service():
    return Neo4jService()

def get_vector_service():
    return VertexVectorService()

@router.post("/analisar/{sessao_id}")
async def analisar_sessao_com_id(
    sessao_id: str,
    transcricao: str = Form(...),
    contexto_paciente: Optional[str] = Form(None),
    claude_service: ClaudeService = Depends(get_claude_service),
    firestore_service: FirestoreService = Depends(get_firestore_service),
    neo4j_service: Neo4jService = Depends(get_neo4j_service),
    vector_service: VertexVectorService = Depends(get_vector_service)
):
    """Realiza análise dimensional VINTRA de uma transcrição com ID de sessão"""
    
    return await _analisar_transcricao(
        transcricao, 
        contexto_paciente, 
        sessao_id, 
        claude_service, 
        firestore_service, 
        neo4j_service, 
        vector_service
    )

@router.post("/analisar")
async def analisar_sessao(
    request: AnalysisRequest,
    claude_service: ClaudeService = Depends(get_claude_service),
    firestore_service: FirestoreService = Depends(get_firestore_service),
    neo4j_service: Neo4jService = Depends(get_neo4j_service),
    vector_service: VertexVectorService = Depends(get_vector_service)
):
    """Realiza análise dimensional VINTRA de uma transcrição"""
    
    return await _analisar_transcricao(
        request.transcricao, 
        request.contexto_paciente, 
        request.sessao_id or f"temp_{int(time.time())}", 
        claude_service, 
        firestore_service, 
        neo4j_service, 
        vector_service
    )

async def _analisar_transcricao(
    transcricao: str,
    contexto_paciente: Optional[str],
    sessao_id: str,
    claude_service: ClaudeService,
    firestore_service: FirestoreService,
    neo4j_service: Neo4jService,
    vector_service: VertexVectorService
):
    """Função auxiliar para analisar transcrição"""
    
    # Chamar Claude para análise dimensional
    analise = await claude_service.analyze_dimensional(transcricao, contexto_paciente)
    
    # Armazenar no Firestore
    analysis_id = await firestore_service.store_dimensional_analysis(sessao_id, analise)
    
    # Criar nó de estado dimensional no Neo4j
    try:
        node_id = await neo4j_service.create_dimensional_state(sessao_id, analise)
        print(f"Nó dimensional criado com ID: {node_id}")
    except Exception as e:
        print(f"Erro ao criar nó dimensional no Neo4j: {e}")
    
    # Criar embedding vetorial
    try:
        embedding = await vector_service.create_dimensional_embedding(
            analise, 
            transcricao
        )
        print(f"Embedding criado com {embedding['dimensions']} dimensões")
        # Armazenar embedding
        await vector_service.store_embedding(sessao_id, embedding)
    except Exception as e:
        print(f"Erro ao criar embedding: {e}")
    
    # Retornar análise dimensional
    return {
        "id": analysis_id,
        "sessao_id": sessao_id,
        **analise
    }

@router.get("/similar/{sessao_id}")
async def buscar_similares(
    sessao_id: str,
    limit: int = 5,
    firestore_service: FirestoreService = Depends(get_firestore_service),
    vector_service: VertexVectorService = Depends(get_vector_service)
):
    """Busca sessões similares com base em valores dimensionais"""
    
    # Implementação simples para MVP
    # Em produção usaria Firestore para buscar valores dimensionais reais
    # e Vertex Vector Search para busca semântica
    
    # Valores mock para demonstração
    dimensional_values = {
        "v1": -2.5,
        "v2": 7.0,
        "v3": 3.0,
        "v4": 8.0,
        "v5": 6.0,
        "v6": 5.0,
        "v7": 4.0,
        "v8": 7.0,
        "v9_past": 7.0,
        "v9_present": 3.0,
        "v9_future": 2.0,
        "v10": 4.0
    }
    
    # Buscar sessões similares
    similar_sessions = await vector_service.search_similar_sessions(dimensional_values, limit)
    
    return {
        "sessao_id": sessao_id,
        "similar_sessions": similar_sessions
    }