import os
from neo4j import GraphDatabase

class Neo4jService:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI")
        self.username = os.getenv("NEO4J_USERNAME")
        self.password = os.getenv("NEO4J_PASSWORD")
        self.driver = self._create_driver()
        
    def _create_driver(self):
        if not all([self.uri, self.username, self.password]):
            raise ValueError("Credenciais Neo4j não configuradas")
        return GraphDatabase.driver(self.uri, auth=(self.username, self.password))
    
    def close(self):
        self.driver.close()
    
    async def create_patient_node(self, patient_id, metadata):
        """
        Cria nó do paciente no grafo
        
        Args:
            patient_id: ID do paciente no Firestore
            metadata: Metadados generalizados (não identificáveis)
            
        Returns:
            str: ID do nó criado
        """
        with self.driver.session() as session:
            result = session.run(
                """
                CREATE (p:Patient {patient_id: $patient_id, created_at: datetime()})
                SET p += $metadata
                RETURN id(p) as node_id
                """,
                patient_id=patient_id,
                metadata=metadata
            )
            record = result.single()
            return record["node_id"] if record else None
    
    async def create_session_node(self, session_id, patient_id, session_metadata):
        """
        Cria nó de sessão e o conecta ao paciente
        
        Args:
            session_id: ID da sessão no Firestore
            patient_id: ID do paciente
            session_metadata: Metadados da sessão
            
        Returns:
            str: ID do nó de sessão criado
        """
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (p:Patient {patient_id: $patient_id})
                CREATE (s:Session {session_id: $session_id, created_at: datetime()})
                SET s += $metadata
                CREATE (p)-[:HAS_SESSION]->(s)
                RETURN id(s) as node_id
                """,
                patient_id=patient_id,
                session_id=session_id,
                metadata=session_metadata
            )
            record = result.single()
            return record["node_id"] if record else None
    
    async def create_dimensional_state(self, session_id, dimensional_data):
        """
        Cria nó de estado dimensional e o conecta à sessão
        
        Args:
            session_id: ID da sessão
            dimensional_data: Dados dimensionais (valores v1-v10)
            
        Returns:
            str: ID do nó de estado dimensional
        """
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (s:Session {session_id: $session_id})
                CREATE (d:DimensionalState {
                    created_at: datetime(),
                    v1: $dim.v1,
                    v2: $dim.v2,
                    v3: $dim.v3,
                    v4: $dim.v4,
                    v5: $dim.v5,
                    v6: $dim.v6,
                    v7: $dim.v7,
                    v8: $dim.v8,
                    v9_past: $dim.v9_past,
                    v9_present: $dim.v9_present,
                    v9_future: $dim.v9_future,
                    v10: $dim.v10
                })
                CREATE (s)-[:HAS_STATE]->(d)
                RETURN id(d) as node_id
                """,
                session_id=session_id,
                dim=dimensional_data
            )
            record = result.single()
            return record["node_id"] if record else None
    
    async def create_state_transition(self, from_state_id, to_state_id, transition_metadata):
        """
        Cria relação de transição entre estados dimensionais
        
        Args:
            from_state_id: ID do estado inicial
            to_state_id: ID do estado final
            transition_metadata: Metadados sobre a transição
            
        Returns:
            bool: Sucesso da operação
        """
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (s1:DimensionalState), (s2:DimensionalState)
                WHERE id(s1) = $from_id AND id(s2) = $to_id
                CREATE (s1)-[t:TRANSITIONS_TO]->(s2)
                SET t += $metadata
                RETURN t
                """,
                from_id=from_state_id,
                to_id=to_state_id,
                metadata=transition_metadata
            )
            return result.single() is not None
    
    async def find_similar_states(self, dimensional_values, limit=5):
        """
        Encontra estados dimensionais similares baseados em distância euclidiana
        
        Args:
            dimensional_values: Valores dimensionais atuais
            limit: Número máximo de resultados
            
        Returns:
            list: Estados similares
        """
        # Cypher para calcular distância euclidiana entre vetores dimensionais
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (d:DimensionalState)
                WITH d, 
                     sqrt(
                        (d.v1 - $dim.v1)^2 + 
                        (d.v2 - $dim.v2)^2 + 
                        (d.v3 - $dim.v3)^2 + 
                        (d.v4 - $dim.v4)^2 + 
                        (d.v5 - $dim.v5)^2 + 
                        (d.v6 - $dim.v6)^2 + 
                        (d.v7 - $dim.v7)^2 + 
                        (d.v8 - $dim.v8)^2 + 
                        (d.v9_past - $dim.v9_past)^2 + 
                        (d.v9_present - $dim.v9_present)^2 + 
                        (d.v9_future - $dim.v9_future)^2 + 
                        (d.v10 - $dim.v10)^2
                     ) as distance
                ORDER BY distance ASC
                LIMIT $limit
                MATCH (s:Session)-[:HAS_STATE]->(d)
                RETURN d, distance, s.session_id as session_id
                """,
                dim=dimensional_values,
                limit=limit
            )
            return [dict(record) for record in result]