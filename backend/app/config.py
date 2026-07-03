from functools import lru_cache
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str = Field(validation_alias=AliasChoices("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"))
    supabase_anon_key: str = Field(
        validation_alias=AliasChoices("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )
    supabase_service_role_key: str = Field(validation_alias="SUPABASE_SERVICE_ROLE_KEY")
    cors_origins: str = Field(default="http://localhost:4000", validation_alias="CORS_ORIGINS")

    model_config = SettingsConfigDict(env_file=".env.local", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
