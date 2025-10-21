import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LogEntry, Pallet, Product } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeProductionLog = async (
  logs: LogEntry[],
  products: Product[],
  pallets: Pallet[]
): Promise<string> => {
  const prompt = `
    Você é um assistente de IA para um supervisor de linha de produção industrial.
    Sua tarefa é analisar os seguintes dados de produção e identificar possíveis problemas, anomalias ou ineficiências.
    Forneça um resumo conciso de suas descobertas em formato markdown. Destaque os problemas críticos e forneça recomendações práticas.

    **Contexto:** Os dados abaixo representam o estado atual da linha de produção, incluindo registros de eventos, produtos escaneados e pallets em formação.

    **Dados:**
    - **Registro de Atividade Recente (JSON):** ${JSON.stringify(logs.slice(0, 25), null, 2)}
    - **Lista de Produtos (JSON):** ${JSON.stringify(products, null, 2)}
    - **Lista de Pallets (JSON):** ${JSON.stringify(pallets, null, 2)}

    **Pontos de Análise:**
    1.  **Produtos Pendentes:** Identifique produtos escaneados há muito tempo (ex: mais de 5 minutos) mas ainda não vinculados a um pallet. Isso indica um gargalo.
    2.  **Frequência de Erros:** Analise os logs em busca de avisos ou erros recorrentes. Qual a possível causa?
    3.  **Atrasos no Processo:** Calcule o tempo médio entre o escaneamento de um produto e sua vinculação a um pallet. Esse tempo é aceitável ou está aumentando?
    4.  **Eficiência de Pallets:** Existem pallets com poucos itens que foram criados há muito tempo? Isso pode indicar um fluxo de produção lento ou ociosidade.
    5.  **Anomalias em Dispositivos:** Algum dispositivo específico está associado a uma quantidade desproporcional de erros ou avisos nos logs?

    **Formato do Relatório:**
    Gere um relatório claro com títulos para cada ponto de análise. Use negrito para destacar métricas importantes. Termine com uma seção de "Recomendações".
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing production log with Gemini:", error);
    return "Erro: Não foi possível analisar os dados de produção. Verifique a conexão e a chave da API.";
  }
};
