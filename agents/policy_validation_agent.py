"""
Policy Validation Agent — checks whether the claim meets policy eligibility rules
and flags any compliance violations that may indicate fraud.
"""

import os
import sys
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from llm_factory import get_llm


class PolicyValidationResult(BaseModel):
    is_policy_valid: bool = Field(description="Whether the claim appears to comply with policy terms")
    violations: list[str] = Field(description="List of identified policy violations or anomalies")
    eligibility_flags: list[str] = Field(description="Eligibility concerns that need further investigation")
    validation_summary: str = Field(description="One-paragraph plain-English summary of the validation result")


_parser = PydanticOutputParser(pydantic_object=PolicyValidationResult)

POLICY_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "You are an insurance policy compliance specialist. Your job is to validate "
     "claims based ONLY on what is explicitly written. Never infer or assume.\n\n"

     "ABSOLUTE RULES — follow these exactly, no exceptions:\n\n"

     "RULE 1 — POLICE REPORT:\n"
     "  - The phrase 'police report' alone means the report WAS filed. Mark as POSITIVE.\n"
     "  - Only flag as a violation if the query contains: 'no police report', "
     "    'police report not filed', 'police report unavailable', 'without police report'.\n"
     "  - Example: 'Utility vehicle claim, police report' → police report is FILED. No violation.\n\n"

     "RULE 2 — THIRD PARTY FAULT:\n"
     "  - 'Third party fault' or 'third party at fault' means the claimant is NOT responsible.\n"
     "  - This is a POSITIVE factor. Do not flag it as a violation.\n\n"

     "RULE 3 — NO PREVIOUS CLAIMS:\n"
     "  - 'No previous claims' is a POSITIVE factor. Do not flag it.\n\n"

     "RULE 4 — GENERAL:\n"
     "  - Only flag violations that are explicitly and clearly stated as negative facts.\n"
     "  - Do not use historical context to override what the query says.\n"
     "  - If in doubt, do NOT flag a violation.\n\n"

     "{format_instructions}"),
    ("human",
     "Claim details: {query}\n\n"
     "Supporting historical context (for reference only — do not override the claim details):\n{context}"),
])


def run_policy_validation_agent(query: str, retrieved_claims: list[dict]) -> dict:
    """
    Validate policy compliance for the submitted claim.
    Returns a PolicyValidationResult dict.
    """
    llm = get_llm(temperature=0)

    context = "\n".join(
        f"- {c['document']}"
        for c in retrieved_claims[:3]
    )

    chain = POLICY_PROMPT | llm | _parser
    result: PolicyValidationResult = chain.invoke({
        "query":               query,
        "context":             context,
        "format_instructions": _parser.get_format_instructions(),
    })
    return result.model_dump()
