"""
Investigation Store — saves completed fraud investigation results back to Pinecone.

Each investigation is stored as a vector alongside the original training claims,
with metadata field `record_type = "investigation"` to distinguish them.
Future searches automatically surface past investigations as historical context.
"""

from __future__ import annotations
import uuid
from datetime import datetime, timezone

from pinecone import Pinecone

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from config import settings
from llm_factory import get_embeddings


def _get_index():
    pc = Pinecone(api_key=settings.pinecone_api_key)
    return pc.Index(settings.pinecone_index_name)


def _build_document(query: str, result: dict) -> str:
    """Convert investigation result into a searchable text document."""
    risk   = result.get("risk_assessment", {})
    rec    = result.get("recommendation", {})
    policy = result.get("policy_validation", {})

    factors = "; ".join(risk.get("key_risk_factors", []))
    steps   = "; ".join(rec.get("investigation_steps", [])[:3])

    return (
        f"Investigation Query: {query}. "
        f"Fraud Probability: {risk.get('fraud_probability', 'N/A')}. "
        f"Risk Level: {risk.get('risk_level', 'N/A')}. "
        f"Decision: {rec.get('decision', 'N/A')}. "
        f"Priority: {rec.get('priority', 'N/A')}. "
        f"Key Risk Factors: {factors}. "
        f"Policy Valid: {policy.get('is_policy_valid', 'N/A')}. "
        f"Investigation Steps: {steps}. "
        f"Estimated Fraud Savings: {rec.get('estimated_fraud_savings', 'N/A')}."
    )


def _build_metadata(query: str, result: dict, timestamp: str) -> dict:
    risk   = result.get("risk_assessment", {})
    rec    = result.get("recommendation", {})
    policy = result.get("policy_validation", {})

    decision = rec.get("decision", "UNKNOWN")
    fraud_label = "Y" if decision in ("ESCALATE", "REJECT") else "N"

    return {
        "record_type":        "investigation",
        "query":              query[:500],
        "fraud_label":        fraud_label,
        "fraud_probability":  str(risk.get("fraud_probability", "")),
        "risk_level":         risk.get("risk_level", ""),
        "decision":           decision,
        "priority":           rec.get("priority", ""),
        "is_policy_valid":    str(policy.get("is_policy_valid", "")),
        "human_decision":     result.get("human_decision", ""),
        "timestamp":          timestamp,
    }


def save_investigation(query: str, result: dict) -> str:
    """
    Embed and upsert a completed investigation into Pinecone.
    Returns the investigation ID.
    """
    inv_id    = f"investigation_{uuid.uuid4().hex[:12]}"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    doc      = _build_document(query, result)
    metadata = _build_metadata(query, result, timestamp)
    metadata["text"] = doc   # store raw text for retrieval

    embedder   = get_embeddings()
    vector     = embedder.embed_query(doc)
    index      = _get_index()

    index.upsert(vectors=[{
        "id":       inv_id,
        "values":   vector,
        "metadata": metadata,
    }])

    return inv_id


def get_recent_investigations(limit: int = 50) -> list[dict]:
    """
    Fetch recent investigations stored in Pinecone.
    Uses a neutral query vector to retrieve investigation records.
    """
    embedder = get_embeddings()
    index    = _get_index()

    # Embed a neutral query to search across all investigations
    query_vec = embedder.embed_query("insurance fraud investigation claim analysis")

    results = index.query(
        vector=query_vec,
        top_k=limit,
        filter={"record_type": {"$eq": "investigation"}},
        include_metadata=True,
    )

    investigations = []
    for match in results.matches:
        meta = dict(match.metadata)
        meta.pop("text", None)   # remove raw text from response
        investigations.append({
            "id":    match.id,
            "score": round(float(match.score), 3),
            **meta,
        })

    # Sort by timestamp descending (most recent first)
    investigations.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return investigations
