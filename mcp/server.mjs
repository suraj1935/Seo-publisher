#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const server = new McpServer({
  name: "seo-publisher",
  version: "0.1.0",
});

function projectPath(...segments) {
  return path.join(root, ...segments);
}

async function readTextFile(relativePath) {
  const absolute = projectPath(relativePath);
  const resolved = path.resolve(absolute);

  if (!resolved.startsWith(root)) {
    throw new Error("Path is outside the project root.");
  }

  if (relativePath.includes(".env")) {
    throw new Error("Environment files are not exposed by this MCP server.");
  }

  return readFile(resolved, "utf8");
}

function runNpmScript(script) {
  return new Promise((resolve) => {
    execFile(
      "npm.cmd",
      ["run", script],
      {
        cwd: root,
        timeout: 120000,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          exitCode: error?.code ?? 0,
          stdout,
          stderr,
        });
      }
    );
  });
}

async function listRoutes(dir = "app", prefix = "") {
  const absolute = projectPath(dir);
  const entries = await readdir(absolute, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const entryRoute = path.posix.join(prefix, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await listRoutes(entryPath, entryRoute)));
    } else if (entry.name === "page.tsx") {
      const route = `/${prefix}`
        .replace(/\/page$/, "")
        .replace(/\/index$/, "")
        .replace(/\/$/, "");
      routes.push(route || "/");
    } else if (entry.name === "route.ts") {
      routes.push(`/${prefix}` || "/");
    }
  }

  return [...new Set(routes)].sort();
}

server.registerResource(
  "product-template",
  "seo-publisher://product-template",
  {
    title: "Sun Sky Product Template",
    description: "The current editable product display template used by the SEO publisher.",
    mimeType: "text/typescript",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/typescript",
        text: await readTextFile("lib/product-template.ts"),
      },
    ],
  })
);

server.registerResource(
  "project-routes",
  "seo-publisher://routes",
  {
    title: "Next.js Routes",
    description: "Current routes found under the app directory.",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(await listRoutes(), null, 2),
      },
    ],
  })
);

server.registerResource(
  "source-file",
  new ResourceTemplate("seo-publisher://file/{filePath}", { list: undefined }),
  {
    title: "Project Source File",
    description: "Read a safe project source file. Environment files are blocked.",
  },
  async (uri, { filePath }) => {
    const target = String(filePath);
    const file = await stat(projectPath(target));
    if (!file.isFile()) throw new Error("Requested path is not a file.");

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: await readTextFile(target),
        },
      ],
    };
  }
);

server.registerTool(
  "list_routes",
  {
    title: "List Routes",
    description: "List Next.js routes currently defined under the app directory.",
    inputSchema: {},
  },
  async () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(await listRoutes(), null, 2),
      },
    ],
  })
);

server.registerTool(
  "read_product_template",
  {
    title: "Read Product Template",
    description: "Read the Sun Sky product display template source.",
    inputSchema: {},
  },
  async () => ({
    content: [
      {
        type: "text",
        text: await readTextFile("lib/product-template.ts"),
      },
    ],
  })
);

server.registerTool(
  "run_project_check",
  {
    title: "Run Project Check",
    description: "Run a safe npm project check script.",
    inputSchema: {
      script: z.enum(["lint", "build"]).describe("The npm script to run."),
    },
  },
  async ({ script }) => {
    const result = await runNpmScript(script);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
