# SEO Publisher

Next.js publisher for creating and managing Sun Sky product/SEO pages with Supabase.

## Run Locally

```bash
npm install
npm run dev
```

Open:

- Admin login: `http://localhost:4000/admin/login`
- Product display preview: `http://localhost:4000/product-display`

## Supabase Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase URL, anon key, and service role key.
3. Run `schema.sql` in the Supabase SQL Editor.

Do not commit `.env.local`.

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
- `run_project_check`: Runs `npm run lint` or `npm run build`.

Available MCP resources:

- `seo-publisher://product-template`
- `seo-publisher://routes`
- `seo-publisher://file/{filePath}`

The server blocks `.env` files so local secrets are not exposed through MCP.
