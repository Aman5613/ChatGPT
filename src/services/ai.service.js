const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model : "gemini-2.5-flash",
    contents : `${prompt} +  use simple and clear language and use emojis and user-friendly formatting.`
  })
  return response.text;
}


module.exports = {generateResponse};