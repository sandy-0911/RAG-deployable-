// Note: In a real app, use @pinecone-database/pinecone
// For this refactor, we provide the logic structure for querying your index.

export const queryVectorDB = async (vector: number[], topK: number = 3) => {
  const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
  const PINECONE_HOST = process.env.PINECONE_HOST;

  if (!PINECONE_API_KEY || !PINECONE_HOST) {
    console.warn("Pinecone credentials missing. Falling back to mock data.");
    return [
      { metadata: { text: "Quicksort is a divide-and-conquer algorithm that selects a pivot and partitions the array." } },
      { metadata: { text: "Merge sort is stable and has O(n log n) time complexity." } }
    ];
  }

  const response = await fetch(`${PINECONE_HOST}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vector,
      topK,
      includeMetadata: true
    })
  });

  const data = await response.json();
  return data.matches || [];
};
