from datetime import datetime, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from postgrest.exceptions import APIError
from supabase import Client, create_client

from .config import get_settings
from .models import PageCreate, PageOut, PageSummary, PageUpdate, SavePageResponse
from .quality import run_quality_checks

RESERVED_SLUGS = {"admin", "api", "sitemap.xml", "robots.txt", "_next", "favicon.ico"}

settings = get_settings()
app = FastAPI(title="SEO Publisher API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def service_client() -> Client:
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def anon_client() -> Client:
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def clean_slug(slug: str) -> str:
    return slug.strip().lower().lstrip("/")


def api_error(exc: APIError) -> HTTPException:
    message = getattr(exc, "message", None) or str(exc)
    code = getattr(exc, "code", None)
    if code == "PGRST116":
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)
    return HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=message)


async def require_admin(authorization: Annotated[str | None, Header()] = None) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token.")

    token = authorization.split(" ", 1)[1]
    try:
        response = anon_client().auth.get_user(token)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Supabase session.") from exc

    user = getattr(response, "user", None)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Supabase session.")

    return {"id": str(user.id), "email": user.email}


def build_payload(page: PageCreate | PageUpdate, existing_id: str | None, user_id: str) -> tuple[dict, dict]:
    slug = clean_slug(page.slug)
    if slug in RESERVED_SLUGS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"issues": [{"field": "slug", "message": f'"{slug}" is a reserved route.', "severity": "error"}]},
        )

    quality_report = run_quality_checks(page.meta_title, page.meta_description, page.html_content, page.json_ld)

    if page.publish and not quality_report["passed"]:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"issues": quality_report["issues"]})

    payload = {
        "slug": slug,
        "meta_title": page.meta_title,
        "meta_description": page.meta_description,
        "meta_keywords": page.meta_keywords,
        "og_title": page.og_title,
        "og_description": page.og_description,
        "og_image_url": page.og_image_url,
        "html_content": page.html_content,
        "css_content": page.css_content or "",
        "js_content": page.js_content or "",
        "json_ld": page.json_ld,
        "content_hash": quality_report["contentHash"],
        "quality_passed": quality_report["passed"],
        "quality_report": quality_report,
        "status": "published" if page.publish else "draft",
        "published_at": datetime.now(timezone.utc).isoformat() if page.publish else None,
        "created_by": user_id if existing_id is None else None,
    }
    if existing_id is not None:
        payload.pop("created_by", None)
    return payload, quality_report


def ensure_not_duplicate(content_hash: str, page_id: str | None) -> str | None:
    query = service_client().table("seo_pages").select("id, slug, content_hash").eq("status", "published")
    if page_id:
        query = query.neq("id", page_id)
    existing = query.execute().data or []
    match = next((row for row in existing if row.get("content_hash") == content_hash), None)
    return match.get("slug") if match else None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "seo-publisher-api"}


@app.get("/api/pages", response_model=list[PageSummary])
def list_pages(_: Annotated[dict, Depends(require_admin)]) -> list[dict]:
    try:
        return (
            service_client()
            .table("seo_pages")
            .select("id, slug, meta_title, status, quality_passed, updated_at")
            .order("updated_at", desc=True)
            .execute()
            .data
            or []
        )
    except APIError as exc:
        raise api_error(exc) from exc


@app.get("/api/pages/{page_id}", response_model=PageOut)
def get_page(page_id: str, _: Annotated[dict, Depends(require_admin)]) -> dict:
    try:
        data = service_client().table("seo_pages").select("*").eq("id", page_id).single().execute().data
    except APIError as exc:
        raise api_error(exc) from exc
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    return data


@app.post("/api/pages", response_model=SavePageResponse)
def create_page(page: PageCreate, user: Annotated[dict, Depends(require_admin)]) -> dict:
    try:
        payload, quality_report = build_payload(page, None, user["id"])
        if page.publish:
            duplicate = ensure_not_duplicate(quality_report["contentHash"], None)
            if duplicate:
                return {
                    "success": False,
                    "duplicateOf": duplicate,
                    "issues": [
                        {
                            "field": "html_content",
                            "message": f"Content is near-identical to an already-published page (/{duplicate}).",
                            "severity": "error",
                        }
                    ],
                }
        data = service_client().table("seo_pages").insert(payload).execute().data
        return {"success": True, "page": data[0] if data else None}
    except APIError as exc:
        raise api_error(exc) from exc
    except HTTPException as exc:
        if exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
            return {"success": False, **exc.detail}
        raise


@app.put("/api/pages/{page_id}", response_model=SavePageResponse)
def update_page(page_id: str, page: PageUpdate, user: Annotated[dict, Depends(require_admin)]) -> dict:
    try:
        payload, quality_report = build_payload(page, page_id, user["id"])
        if page.publish:
            duplicate = ensure_not_duplicate(quality_report["contentHash"], page_id)
            if duplicate:
                return {
                    "success": False,
                    "duplicateOf": duplicate,
                    "issues": [
                        {
                            "field": "html_content",
                            "message": f"Content is near-identical to an already-published page (/{duplicate}).",
                            "severity": "error",
                        }
                    ],
                }
        data = service_client().table("seo_pages").update(payload).eq("id", page_id).execute().data
        return {"success": True, "page": data[0] if data else None}
    except APIError as exc:
        raise api_error(exc) from exc
    except HTTPException as exc:
        if exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
            return {"success": False, **exc.detail}
        raise


@app.get("/api/public/pages/{slug}", response_model=PageOut)
def get_public_page(slug: str) -> dict:
    try:
        data = (
            service_client()
            .table("seo_pages")
            .select("*")
            .eq("slug", clean_slug(slug))
            .eq("status", "published")
            .single()
            .execute()
            .data
        )
    except APIError as exc:
        raise api_error(exc) from exc
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    return data


@app.get("/api/public/slugs")
def list_public_slugs() -> list[dict[str, str | None]]:
    try:
        return (
            service_client()
            .table("seo_pages")
            .select("slug, updated_at")
            .eq("status", "published")
            .execute()
            .data
            or []
        )
    except APIError as exc:
        raise api_error(exc) from exc
