import Ajv from "ajv";
import crypto from "crypto";
 
const ajv = new Ajv({ allErrors: true, strict: false });
 
export interface PageInput {
  meta_title: string;
  meta_description: string;
  html_content: string;
  json_ld: Record<string, unknown>;
}
 
export interface QualityIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}
 
export interface QualityReport {
  passed: boolean;
  issues: QualityIssue[];
  contentHash: string;
}
 
// Minimal structural schema — every JSON-LD block must at least declare
// a valid @context and @type. You can extend this per-type (Article,
// LocalBusiness, FAQPage, etc.) as your page templates diversify.
const jsonLdBaseSchema = {
  type: "object",
  properties: {
    "@context": { type: "string" },
    "@type": { type: "string" },
  },
  required: ["@context", "@type"],
};
 
const validateJsonLd = ajv.compile(jsonLdBaseSchema);
 
function countH1Tags(html: string): number {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}
 
export function computeContentHash(input: PageInput): string {
  // Hash on the parts that determine "is this thin/duplicate content" —
  // title + description + visible HTML, deliberately excluding CSS/JS/slug
  // so two pages with identical copy but different styling still get caught.
  const normalized = [
    input.meta_title.trim().toLowerCase(),
    input.meta_description.trim().toLowerCase(),
    input.html_content.replace(/\s+/g, " ").trim().toLowerCase(),
  ].join("|");
 
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
 
export function runQualityChecks(input: PageInput): QualityReport {
  const issues: QualityIssue[] = [];
 
  // --- Title length ---
  if (!input.meta_title || input.meta_title.trim().length === 0) {
    issues.push({ field: "meta_title", message: "Meta title is required.", severity: "error" });
  } else if (input.meta_title.length > 60) {
    issues.push({
      field: "meta_title",
      message: `Meta title is ${input.meta_title.length} chars — keep it ≤60 to avoid truncation in SERPs.`,
      severity: "error",
    });
  }
 
  // --- Description length ---
  const descLen = input.meta_description?.length ?? 0;
  if (descLen === 0) {
    issues.push({ field: "meta_description", message: "Meta description is required.", severity: "error" });
  } else if (descLen < 120 || descLen > 160) {
    issues.push({
      field: "meta_description",
      message: `Meta description is ${descLen} chars — recommended range is 120–160.`,
      severity: descLen > 160 ? "error" : "warning",
    });
  }
 
  // --- H1 checks ---
  const h1Count = countH1Tags(input.html_content || "");
  if (h1Count === 0) {
    issues.push({ field: "html_content", message: "No <h1> tag found — every page needs exactly one.", severity: "error" });
  } else if (h1Count > 1) {
    issues.push({ field: "html_content", message: `Found ${h1Count} <h1> tags — duplicate H1s dilute topical signal. Use exactly one.`, severity: "error" });
  }
 
  // --- JSON-LD structural validation ---
  if (!input.json_ld || Object.keys(input.json_ld).length === 0) {
    issues.push({ field: "json_ld", message: "JSON-LD is empty — structured data helps rich results.", severity: "warning" });
  } else {
    const valid = validateJsonLd(input.json_ld);
    if (!valid) {
      const messages = (validateJsonLd.errors || []).map((e) => `${e.instancePath || "root"} ${e.message}`).join("; ");
      issues.push({ field: "json_ld", message: `JSON-LD failed schema validation: ${messages}`, severity: "error" });
    }
  }
 
  const hasErrors = issues.some((i) => i.severity === "error");
 
  return {
    passed: !hasErrors,
    issues,
    contentHash: computeContentHash(input),
  };
}
 
// Call this against existing published pages (fetched separately from Supabase)
// to catch near-duplicate content before allowing publish.
export function isDuplicateHash(hash: string, existingHashes: string[]): boolean {
  return existingHashes.includes(hash);
}
