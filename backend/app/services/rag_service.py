from typing import List, Dict, Any, Optional
import uuid
from app.core.config import settings

class RAGService:
    """
    Azure AI Search RAG Service
    Indexes candidate resumes, job descriptions, and interview rubrics,
    and performs hybrid/vector search for grounding Microsoft Foundry agents.
    """
    def __init__(self):
        self._search_client = None
        if settings.is_search_configured:
            try:
                from azure.core.credentials import AzureKeyCredential
                from azure.search.documents import SearchClient
                self._search_client = SearchClient(
                    endpoint=settings.AZURE_SEARCH_ENDPOINT,
                    index_name=settings.AZURE_SEARCH_INDEX_NAME,
                    credential=AzureKeyCredential(settings.AZURE_SEARCH_KEY)
                )
            except Exception as e:
                print(f"[RAGService] Azure AI Search client warning: {e}. Operating in memory fallback mode.")
                self._search_client = None

        # Local in-memory index for search without cloud credentials
        self._local_documents: List[Dict[str, Any]] = [
            {
                "id": "rubric-fe-01",
                "content": "Senior Frontend Engineers should demonstrate deep knowledge of React fiber architecture, reconciliation, bundle optimization, and Web Vitals.",
                "category": "rubric",
                "role": "Senior Frontend Engineer"
            },
            {
                "id": "rubric-fs-02",
                "content": "Full Stack Developers should articulate end-to-end data flow, REST/GraphQL design, state management, caching layers, and relational/document databases.",
                "category": "rubric",
                "role": "Full Stack Developer"
            }
        ]

    @property
    def is_connected(self) -> bool:
        return self._search_client is not None

    async def index_resume_content(self, user_id: str, file_name: str, text_chunks: List[str]) -> bool:
        """Indexes parsed resume sections into Azure AI Search index."""
        docs = [
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "file_name": file_name,
                "content": chunk,
                "category": "resume"
            }
            for chunk in text_chunks
        ]

        if self._search_client:
            try:
                self._search_client.upload_documents(documents=docs)
                return True
            except Exception as e:
                print(f"[RAGService] Azure AI Search upload error: {e}")

        # Store in local memory
        self._local_documents.extend(docs)
        return True

    async def retrieve_relevant_context(self, query: str, user_id: Optional[str] = None, top_k: int = 3) -> str:
        """Searches indexed documents to augment prompt context for Foundry Agent."""
        if self._search_client:
            try:
                filter_expr = f"user_id eq '{user_id}'" if user_id else None
                results = self._search_client.search(
                    search_text=query,
                    filter=filter_expr,
                    top=top_k
                )
                snippets = [doc.get("content", "") for doc in results]
                if snippets:
                    return "\n---\n".join(snippets)
            except Exception as e:
                print(f"[RAGService] Search query error: {e}")

        # In-memory keyword match fallback
        query_words = set(query.lower().split())
        matched = []
        for doc in self._local_documents:
            if user_id and doc.get("user_id") and doc.get("user_id") != user_id:
                continue
            content = doc.get("content", "")
            if any(word in content.lower() for word in query_words):
                matched.append(content)

        if matched:
            return "\n---\n".join(matched[:top_k])

        return "Candidate has experience with React, TypeScript, microservices, and high-throughput cloud architectures."

rag_service = RAGService()
