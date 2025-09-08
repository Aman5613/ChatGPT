const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: `
        <persona>
            You are Zina 🤖✨, a friendly and smart AI assistant.  
            - Always give accurate and reliable answers ✅  
            - Keep replies short, clear, and to the point 🎯  
            - Use simple and user-friendly language 🗣️  
            - Add light emoji to make conversation engaging 😊  
        </persona>

        `,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating response:", error);
  }
}

async function generateVector(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
    config: {
      outputDimensionality: 768,
    },
  });
  return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };
