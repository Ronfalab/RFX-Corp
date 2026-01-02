import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
// WARNING: process.env.API_KEY is handled by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_CHAT = `
Sei l'assistente esecutivo virtuale di alto livello per "RFX Corp", una holding internazionale.
Il tuo tono è professionale, strategico, conciso ed estremamente competente.
Parli italiano fluente.
Il tuo obiettivo è aiutare il CEO a monitorare il business, analizzare opportunità e risolvere problemi.
Quando parli di dati finanziari, sii preciso.
`;

const SYSTEM_INSTRUCTION_ANALYSIS = `
Sei un analista di strategia aziendale senior per RFX Corp.
Il tuo compito è analizzare i dati o i testi forniti e restituire un'analisi SWOT, rischi potenziali e opportunità di crescita.
Usa una formattazione Markdown chiara.
`;

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    // Transform internal history to Gemini chat history format if needed, 
    // but for simplicity in this demo, we maintain a persistent chat session object locally in the component
    // or just send the context.
    // However, the best practice with the SDK is to create a chat session.
    
    // We will initialize a new chat with history context for each turn in this stateless service wrapper pattern
    // or we could maintain the chat object in the component. 
    // For robustness here, we'll create a fresh chat with history.

    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat: Chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
      },
      history: chatHistory
    });

    const result: GenerateContentResponse = await chat.sendMessage({
        message: newMessage
    });

    return result.text || "Mi dispiace, non ho potuto elaborare una risposta.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Si è verificato un errore di connessione con i sistemi AI di RFX Corp.";
  }
};

export const analyzeBusinessText = async (input: string): Promise<string> => {
  try {
    const prompt = `Analizza il seguente testo/dato aziendale per RFX Corp:\n\n${input}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for deep reasoning
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
      }
    });

    return response.text || "Analisi non disponibile.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Impossibile completare l'analisi strategica al momento.";
  }
};