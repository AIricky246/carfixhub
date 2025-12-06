import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured data
const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: { type: Type.STRING, description: "Detailed diagnosis of the problem based on symptoms and visual evidence" },
    confidenceScore: { type: Type.INTEGER, description: "Confidence score from 0 to 100" },
    urgency: { type: Type.STRING, description: "Low, Medium, or High" },
    potentialCauses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of possible root causes" },
    recommendedAction: { type: Type.STRING, description: "Step-by-step DIY guide or recommendation" },
    identifiedParts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "Location or visual description of the part" }
        },
      },
    },
    maintenanceInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          partName: { type: Type.STRING },
          estimatedRUL: { type: Type.STRING, description: "Remaining Useful Life estimate (e.g., '5,000 miles' or '3 months')" },
          replacementCost: { type: Type.STRING, description: "Estimated cost range" }
        },
      },
      description: "Lifespan estimates based on mileage, year, and climate conditions provided"
    }
  },
};

export interface AnalysisResult {
  diagnosis: string;
  confidenceScore: number;
  urgency: string;
  potentialCauses: string[];
  recommendedAction: string;
  identifiedParts: { name: string; description: string }[];
  maintenanceInsights: { partName: string; estimatedRUL: string; replacementCost: string }[];
}

export const analyzeCarIssue = async (
  textDescription: string,
  contextData: { make: string; model: string; year: string; mileage: string; climate?: string; drivingStyle?: string },
  imageBase64?: string,
  audioBase64?: string
): Promise<AnalysisResult> => {
  try {
    const parts: any[] = [];
    
    // Construct the context string
    const contextStr = `
      Vehicle: ${contextData.year} ${contextData.make} ${contextData.model}
      Mileage: ${contextData.mileage}
      Climate/Region: ${contextData.climate || 'Unknown'}
      Driving Style: ${contextData.drivingStyle || 'Average'}
      User Description: ${textDescription}
    `;

    parts.push({ text: `You are an expert mechanic AI for CarFixHub. 
    Analyze the vehicle issue based on the description, context, audio (if provided), and image (if provided).
    
    If audio is provided, analyze the sound pattern (e.g., squeal, knock, hiss) to identify mechanical failures.
    If an image is provided, identify relevant components and their condition.
    Use the mileage and climate data to estimate the Remaining Useful Life (RUL) of affected parts.

    Return the result in strict JSON format.
    ` });

    parts.push({ text: contextStr });

    if (audioBase64) {
      parts.push({
        inlineData: {
          mimeType: "audio/mp3", // Assuming MP3 or generic audio container from frontend
          data: audioBase64,
        },
      });
    }

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using 2.5 Flash as requested for multimodal tasks
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a fallback error state matching the interface
    return {
      diagnosis: "Failed to analyze the issue. Please try again or check your inputs.",
      confidenceScore: 0,
      urgency: "Unknown",
      potentialCauses: ["Analysis Error"],
      recommendedAction: "Please consult a professional mechanic manually.",
      identifiedParts: [],
      maintenanceInsights: []
    };
  }
};