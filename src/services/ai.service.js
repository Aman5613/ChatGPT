const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt} +  use simple and clear language and use emojis and user-friendly formatting and write in short.`,
  });
  return response.text;
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
