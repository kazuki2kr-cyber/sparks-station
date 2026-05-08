import crypto from "crypto";
import seedRows from "../../data/monetization/saas-case-database.seed.json";

export const SAAS_CASE_DB_PRODUCT_ID = "saas-case-db-v1";
export const SAAS_CASE_DB_BETA_PRICE_JPY = 2980;

export type SaasCaseDbRow = {
  id: string;
  productName: string;
  url: string;
  sourceUrls: string[];
  category: string;
  targetCustomer: string;
  pain: string;
  productSummary: string;
  pricingModel: string;
  priceRange: string;
  revenue: string;
  acquisitionChannel: string;
  gtmPattern: string;
  successFactor: string;
  riskOrFailure: string;
  japanHypothesis: string;
  firstExperiment: string;
  recommendedTools: string[];
  monetizationFit: string;
  confidence: "high" | "medium" | "low";
  notes: string;
};

export const saasCaseDbRows = seedRows as SaasCaseDbRow[];

export function createAccessToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashAccessToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function csvCell(value: unknown): string {
  const raw = Array.isArray(value) ? value.join(" / ") : String(value ?? "");
  return `"${raw.replace(/"/g, '""')}"`;
}

export function makeSaasCaseDbCsv(): string {
  const headers = [
    "id",
    "productName",
    "url",
    "category",
    "targetCustomer",
    "pain",
    "productSummary",
    "pricingModel",
    "priceRange",
    "revenue",
    "acquisitionChannel",
    "gtmPattern",
    "successFactor",
    "riskOrFailure",
    "japanHypothesis",
    "firstExperiment",
    "recommendedTools",
    "monetizationFit",
    "confidence",
    "notes",
    "sourceUrls",
  ] satisfies Array<keyof SaasCaseDbRow>;

  return [
    headers.join(","),
    ...saasCaseDbRows.map((row) => headers.map((key) => csvCell(row[key])).join(",")),
  ].join("\n");
}
