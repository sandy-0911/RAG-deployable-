
# DSA Expert RAG System

A production-ready Retrieval-Augmented Generation (RAG) system built with Next.js, Pinecone, and Google Gemini. This application acts as a specialized tutor for Data Structures and Algorithms.

## Architecture

- **Frontend**: Next.js App Router (Client Components) for a responsive chat interface.
- **Backend**: Next.js API Routes (Edge-ready) for secure query processing.
- **RAG Pipeline**:
  - **Query Transformation**: Context-aware rewriting for multi-turn conversations.
  - **Vector DB**: Pinecone for semantic retrieval of DSA concepts.
  - **LLM**: Gemini 3 Pro/Flash for grounded answer generation.
- **Local Ingestion**: A separate script to process PDFs and upsert embeddings, keeping the production deployment lean.

## My AI Usage

### AI Tools Used
- **Gemini 3 Pro/Flash**: Used for code generation, architectural brainstorming, and refining system instructions.
- **GitHub Copilot**: Assisted with boilerplate UI component logic and TypeScript typing.

### How I Used Them
1.  **Architectural Refactoring**: I used Gemini to brainstorm the separation of concerns between `scripts/ingest.ts` and the `app/api/query` route to ensure Vercel compatibility and security.
2.  **RAG Optimization**: I prompted the AI to help design the "Query Transformation" step, ensuring that follow-up questions like "How does its complexity compare?" are correctly interpreted by the search engine.
3.  **UI/UX**: Copilot was used to generate the Tailwind CSS styling for the chat bubbles and the radial background gradients to give it a "modern engineering" aesthetic.

### Reflection
Using AI significantly accelerated the refactoring process. It allowed me to focus on high-level system design (like the RAG flow and security layers) while the AI handled repetitive tasks like generating TypeScript interfaces and Tailwind utility classes. It acted as a senior pair programmer, helping me catch potential deployment issues like missing CSS directives or environment variable leaks.

## Setup

1.  Clone the repo.
2.  Install dependencies: `npm install`.
3.  Set environment variables in `.env.local`:
    - `API_KEY`: Your Google Gemini API Key.
    - `PINECONE_API_KEY`: Your Pinecone Key.
    - `PINECONE_HOST`: Your Pinecone index host URL.
4.  Run locally: `npm run dev`.
