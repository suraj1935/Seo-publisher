import hashlib
import re
from typing import Any


def compute_content_hash(meta_title: str, meta_description: str, html_content: str) -> str:
    normalized = "|".join(
        [
            meta_title.strip().lower(),
            meta_description.strip().lower(),
            re.sub(r"\s+", " ", html_content).strip().lower(),
        ]
    )
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def run_quality_checks(
    meta_title: str,
    meta_description: str,
    html_content: str,
    json_ld: dict[str, Any],
) -> dict[str, Any]:
    issues: list[dict[str, str]] = []

    if not meta_title.strip():
        issues.append({"field": "meta_title", "message": "Meta title is required.", "severity": "error"})
    elif len(meta_title) > 60:
        issues.append(
            {
                "field": "meta_title",
                "message": f"Meta title is {len(meta_title)} chars - keep it <=60 to avoid truncation in SERPs.",
                "severity": "error",
            }
        )

    desc_len = len(meta_description or "")
    if desc_len == 0:
        issues.append(
            {"field": "meta_description", "message": "Meta description is required.", "severity": "error"}
        )
    elif desc_len < 120 or desc_len > 160:
        issues.append(
            {
                "field": "meta_description",
                "message": f"Meta description is {desc_len} chars - recommended range is 120-160.",
                "severity": "error" if desc_len > 160 else "warning",
            }
        )

    h1_count = len(re.findall(r"<h1[\s>]", html_content or "", flags=re.IGNORECASE))
    if h1_count == 0:
        issues.append(
            {"field": "html_content", "message": "No <h1> tag found - every page needs exactly one.", "severity": "error"}
        )
    elif h1_count > 1:
        issues.append(
            {
                "field": "html_content",
                "message": f"Found {h1_count} <h1> tags - use exactly one.",
                "severity": "error",
            }
        )

    if not json_ld:
        issues.append(
            {
                "field": "json_ld",
                "message": "JSON-LD is empty - structured data helps rich results.",
                "severity": "warning",
            }
        )
    elif not isinstance(json_ld.get("@context"), str) or not isinstance(json_ld.get("@type"), str):
        issues.append(
            {
                "field": "json_ld",
                "message": "JSON-LD must include string @context and @type values.",
                "severity": "error",
            }
        )

    has_errors = any(issue["severity"] == "error" for issue in issues)
    content_hash = compute_content_hash(meta_title, meta_description, html_content)

    return {"passed": not has_errors, "issues": issues, "contentHash": content_hash}
