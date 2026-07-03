# SEO Publisher

Next.js publisher for creating and managing Sun Sky product/SEO pages with a FastAPI REST backend and Supabase database/auth.

## Architecture

- Frontend: Next.js App Router on `http://localhost:4000`
- Backend: FastAPI REST API on `http://127.0.0.1:8000`
- Database/Auth: Supabase Postgres and Supabase Auth
- MCP: local stdio server for project inspection, route listing, checks, and backend health

FastAPI owns page CRUD, quality checks, and public published-page reads. Next.js owns the admin UI, login, server-rendered page output, and sitemap/robots.

## Run Locally

```bash
npm install
npm run dev:backend
npm run dev
```

Open:

- Admin login: `http://localhost:4000/admin/login`
- Product display preview: `http://localhost:4000/product-display`

## Supabase Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase URL, anon key, and service role key.
3. Keep `BACKEND_API_URL=http://127.0.0.1:8000` for local development.
4. Run `schema.sql` in the Supabase SQL Editor.

Do not commit `.env.local`.

## FastAPI Backend

Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

Run the backend:

```bash
npm run dev:backend
```

Useful endpoints:

- `GET /health`
- `GET /api/public/pages/{slug}`
- `GET /api/public/slugs`
- `GET /api/pages` with a Supabase user bearer token
- `POST /api/pages` with a Supabase user bearer token
- `PUT /api/pages/{id}` with a Supabase user bearer token

The backend reads `.env.local`, uses the Supabase service role key only server-side, and validates admin requests with the logged-in Supabase access token.

## CI/CD

GitHub Actions runs on pushes and pull requests to `main`:

- Frontend/MCP job: `npm ci`, `npm run lint`, `npm run build`
- Backend job: installs `backend/requirements.txt`, compiles Python, and imports the FastAPI app

## MCP Server

This project includes a local stdio MCP server for safe project inspection and checks.

Start it manually:

```bash
npm run mcp
```

Example client configuration:

```json
{
  "mcpServers": {
    "seo-publisher": {
      "command": "node",
      "args": [
        "C:/Users/sg200/Desktop/SunSky/seo-publisher/mcp/server.mjs"
      ]
    }
  }
}
```

A ready-to-copy example is also available in `.mcp.example.json`.

Available MCP tools:

- `list_routes`: Lists app routes.
- `read_product_template`: Reads the current Sun Sky product template.
- `run_project_check`: Runs `npm run lint`, `npm run build`, or `npm run check:backend`.
- `check_backend_health`: Calls the local FastAPI `/health` endpoint.

Available MCP resources:

- `seo-publisher://product-template`
- `seo-publisher://routes`
- `seo-publisher://file/{filePath}`

The server blocks `.env` files so local secrets are not exposed through MCP.
