import os
import vertexai
from vertexai.language_models import TextGenerationModel
import re
import json

class ClaudeService:
    def __init__(self):
        # Inicializar Vertex AI
        project_id = os.getenv('GCP_PROJECT_ID')
        location = os.getenv('GCP_REGION', 'us-central1')
        
        # Inicializar Vertex AI
        vertexai.init(project=project_id, location=location)
        
        # Carregar modelo Claude
        self.model = TextGenerationModel.from_pretrained("claude-3-sonnet@20240229")
    
    async def analyze_dimensional(self, transcription, patient_context=None):
        """
        Analisa uma transcrição para extrair dados dimensionais VINTRA
        
        Args:
            transcription: A transcrição textual
            patient_context: Contexto opcional do paciente
            
        Returns:
            dict: Análise dimensional VINTRA
        """
        # Construir prompt para análise dimensional
        prompt = self._build_dimensional_prompt(transcription, patient_context)
        
        # Chamar Claude via Vertex AI
        response = self.model.predict(prompt=prompt, max_output_tokens=8192)
        
        # Processar resposta para extrair valores dimensionais
        raw_response = response.text
        dimensional_values = self._extract_dimensional_values(raw_response)
        
        # Extrair elementos textuais
        narrative = self._extract_section(raw_response, "Síntese Narrativa", "Formulação Integrativa")
        formulation = self._extract_section(raw_response, "Formulação Integrativa", "Recomendações")
        recommendations = self._extract_recommendations(raw_response)
        
        # Montar resultado completo
        result = {
            **dimensional_values,
            "sintese_narrativa": narrative,
            "formulacao_integrativa": formulation,
            "recomendacoes": recommendations,
            "raw_response": raw_response
        }
        
        return result
    
    def _build_dimensional_prompt(self, transcription, patient_context):
        """Constrói prompt para análise dimensional"""
        prompt = f"""
        Você é um assistente clínico especializado no modelo VINTRA (Visualização INtegrativa TRAjetorial).
        
        Analise a seguinte transcrição de acordo com as 10 dimensões do VINTRA:
        
        # Dimensões Emocionais:
        - v₁: Valência Emocional (-5 a +5)
        - v₂: Excitação Emocional (0-10)
        - v₃: Dominância Emocional (0-10)
        - v₄: Intensidade Afetiva (0-10)
        
        # Dimensões Cognitivas:
        - v₅: Complexidade Sintática (0-10)
        - v₆: Coerência Narrativa (0-10)
        - v₇: Flexibilidade Cognitiva (0-10)
        - v₈: Dissonância Cognitiva (0-10)
        
        # Dimensões de Autonomia:
        - v₉: Perspectiva Temporal [passado, presente, futuro] (cada um 0-10)
        - v₁₀: Autocontrole (0-10)
        
        Transcrição: "{transcription}"
        
        Forneça valores para cada dimensão (v₁-v₁₀) nas escalas apropriadas com breve justificativa para cada valor.
        
        Estruture sua resposta nos seguintes blocos bem definidos:
        
        ## Análise Dimensional
        Para cada dimensão (v₁-v₁₀), indique o valor numérico atribuído e a justificativa.
        
        ## Síntese Narrativa
        Elabore uma síntese narrativa (ipsissima) capturando os aspectos principais da fala do paciente.
        
        ## Formulação Integrativa
        Apresente uma formulação integrativa do caso, relacionando as dimensões e propondo hipóteses.
        
        ## Recomendações
        Liste 3-5 recomendações específicas baseadas na análise.
        
        Importante: Para a dimensão v₉, forneça três valores separados: passado, presente e futuro.
        Certifique-se de que todos os valores dimensionais estejam claramente indicados para facilitar a extração.
        """
        
        if patient_context:
            prompt += f"\n\nContexto adicional do paciente: {patient_context}"
            
        return prompt
    
    def _extract_dimensional_values(self, response_text):
        """Extrai valores dimensionais do texto de resposta"""
        # Dicionário para armazenar valores dimensionais
        values = {}
        
        # Extrair valores para v1-v8 e v10
        for i in range(1, 9):
            pattern = rf"v[₁-₁₀]?{i}\s*[:=]\s*([+-]?\d+(\.\d+)?)"
            match = re.search(pattern, response_text, re.IGNORECASE)
            if match:
                values[f"v{i}"] = float(match.group(1))
        
        # Tratar v10 separadamente (pode ser v₁₀ ou v10)
        pattern = r"v[₁₀]?10\s*[:=]\s*([+-]?\d+(\.\d+)?)"
        match = re.search(pattern, response_text, re.IGNORECASE)
        if match:
            values["v10"] = float(match.group(1))
        
        # Extrair valores para v9 (passado, presente, futuro)
        past_pattern = r"v[₉]?9.*passado\s*[:=]\s*([+-]?\d+(\.\d+)?)"
        present_pattern = r"v[₉]?9.*presente\s*[:=]\s*([+-]?\d+(\.\d+)?)"
        future_pattern = r"v[₉]?9.*futuro\s*[:=]\s*([+-]?\d+(\.\d+)?)"
        
        past_match = re.search(past_pattern, response_text, re.IGNORECASE)
        present_match = re.search(present_pattern, response_text, re.IGNORECASE)
        future_match = re.search(future_pattern, response_text, re.IGNORECASE)
        
        if past_match:
            values["v9_past"] = float(past_match.group(1))
        if present_match:
            values["v9_present"] = float(present_match.group(1))
        if future_match:
            values["v9_future"] = float(future_match.group(1))
        
        # Definir valores padrão para dimensões não encontradas
        for i in range(1, 9):
            key = f"v{i}"
            if key not in values:
                values[key] = 5.0  # Valor médio como padrão
        
        if "v10" not in values:
            values["v10"] = 5.0
            
        if "v9_past" not in values:
            values["v9_past"] = 5.0
        if "v9_present" not in values:
            values["v9_present"] = 5.0
        if "v9_future" not in values:
            values["v9_future"] = 5.0
        
        # Trajetória temporal (mock para MVP)
        values["trajetoria"] = {"tendencia": "neutro", "velocidade": 0.5}
        
        return values
    
    def _extract_section(self, text, section_name, next_section=None):
        """Extrai uma seção específica do texto de resposta"""
        pattern = rf"##\s*{section_name}(.*?)"
        if next_section:
            pattern += rf"(?=##\s*{next_section}|$)"
        else:
            pattern += r"$"
            
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            content = match.group(1).strip()
            return content
        return ""
    
    def _extract_recommendations(self, text):
        """Extrai as recomendações como uma lista"""
        recommendations_text = self._extract_section(text, "Recomendações")
        
        # Extrair itens de lista numerados ou com marcadores
        pattern = r"(?:^\d+\.\s*|\*\s*|-)?\s*(.+?)(?=$|\n\d+\.|\n\*|\n-)"
        matches = re.findall(pattern, recommendations_text, re.MULTILINE)
        
        # Limpar e filtrar recomendações vazias
        recommendations = [item.strip() for item in matches if item.strip()]
        
        # Se não conseguir extrair como lista, usar o texto completo
        if not recommendations and recommendations_text:
            return [recommendations_text]
            
        return recommendations