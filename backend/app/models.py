from typing import Any, Literal
from pydantic import BaseModel, Field


PageStatus = Literal["draft", "published", "archived"]


class PageBase(BaseModel):
    slug: str = Field(min_length=1)
    meta_title: str = Field(min_length=1)
    meta_description: str = Field(min_length=1)
    meta_keywords: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image_url: str | None = None
    html_content: str = Field(min_length=1)
    css_content: str = ""
    js_content: str = ""
    json_ld: dict[str, Any] = Field(default_factory=dict)
    publish: bool = False


class PageCreate(PageBase):
    pass


class PageUpdate(PageBase):
    pass


class PageOut(BaseModel):
    id: str
    slug: str
    meta_title: str
    meta_description: str
    meta_keywords: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image_url: str | None = None
    html_content: str
    css_content: str = ""
    js_content: str = ""
    json_ld: dict[str, Any] = Field(default_factory=dict)
    content_hash: str
    quality_passed: bool
    quality_report: dict[str, Any] = Field(default_factory=dict)
    status: PageStatus
    published_at: str | None = None
    created_at: str | None = None
    updated_at: str | None = None
    created_by: str | None = None


class PageSummary(BaseModel):
    id: str
    slug: str
    meta_title: str
    status: PageStatus
    quality_passed: bool
    updated_at: str | None = None


class SavePageResponse(BaseModel):
    success: bool
    page: PageOut | None = None
    issues: list[dict[str, str]] | None = None
    duplicateOf: str | None = None
