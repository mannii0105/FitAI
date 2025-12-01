import { GoogleGenAI, Type } from "@google/genai";
import { BodyMeasurement, DressSuggestion } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeBodyFromImage = async (base64Image: string): Promise<BodyMeasurement> => {
  const ai = getClient();
  
  const prompt = `
    Analyze this full-body image. 
    1. Estimate the body shape (e.g., Hourglass, Pear, Rectangle, Inverted Triangle, Apple).
    2. Estimate clothing size (XS, S, M, L, XL, XXL) based on visual proportions.
    3. Estimate approximate measurements in inches (Shoulders, Bust, Waist, Hips) based on standard proportions for that size/shape.
    4. Provide a confidence score (0-100) based on image clarity.
    
    Return strictly JSON.
  `;

  // We use gemini-2.5-flash for fast multimodal analysis
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bodyShape: { type: Type.STRING },
          estimatedSize: { type: Type.STRING },
          measurements: {
            type: Type.OBJECT,
            properties: {
              shoulders: { type: Type.STRING },
              bust: { type: Type.STRING },
              waist: { type: Type.STRING },
              hips: { type: Type.STRING },
            }
          },
          confidence: { type: Type.NUMBER }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as BodyMeasurement;
};

export const getDressSuggestions = async (measurement: BodyMeasurement): Promise<DressSuggestion[]> => {
  const ai = getClient();

  const prompt = `
    Based on the following body analysis:
    Shape: ${measurement.bodyShape}
    Size: ${measurement.estimatedSize}
    Measurements: ${JSON.stringify(measurement.measurements)}

    Suggest 3 distinct dress styles that would flatter this body type.
    For each suggestion, provide a name, description, reason why it fits, and a style category (e.g., Casual, Evening, Business).
    Also provide a short visual prompt description that could be used to generate an image of this dress.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            reason: { type: Type.STRING },
            style: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  return JSON.parse(text) as DressSuggestion[];
};
