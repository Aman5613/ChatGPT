// Import the Pinecone library
const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create or connect to an index named 'chat-gpt'
const index = pc.Index("chat-gpt", "https://chat-gpt-97c9wcn.svc.aped-4627-b74a.pinecone.io");

// Function to upsert a vector into the Pinecone index
async function createMemory([{ messagesID, vector, metadata }]) {
  await index.upsert([{
    id: messagesID,
    values: vector,
    metadata,
  }]);
}

async function queryMemory({queryVector, metadata, limit = 5}) {
  const data = await index.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeMetadata: true,
  });

  return data.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};
