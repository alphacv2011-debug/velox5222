import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ShippingQuote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quoteSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendedService: {
      type: Type.STRING,
      description: "Nome do serviço recomendado (ex: Velox Express, Cargo Standard).",
    },
    estimatedCost: {
      type: Type.STRING,
      description: "Custo estimado em Reais (ex: R$ 45,00 - R$ 60,00).",
    },
    estimatedTime: {
      type: Type.STRING,
      description: "Tempo estimado de entrega (ex: 2-3 dias úteis).",
    },
    packagingAdvice: {
      type: Type.STRING,
      description: "Dica curta de como embalar o item para segurança.",
    },
  },
  required: ["recommendedService", "estimatedCost", "estimatedTime", "packagingAdvice"],
};

export const calculateShippingQuote = async (itemDescription: string, destination: string): Promise<ShippingQuote> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      Atue como um especialista em logística da transportadora VeloxLog.
      O cliente deseja enviar: "${itemDescription}" para "${destination}".
      Calcule uma estimativa fictícia mas realista de frete.
      Nossos serviços são: 
      1. Velox SameDay (Caro, entrega no mesmo dia)
      2. Velox Express (Médio, 1-3 dias)
      3. Velox Standard (Econômico, 5-10 dias)
      
      Escolha o melhor serviço para o tipo de item. Responda em JSON.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteSchema,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(text) as ShippingQuote;
    return data;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};