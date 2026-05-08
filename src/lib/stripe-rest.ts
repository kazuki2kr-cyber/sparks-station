export type StripeCheckoutSession = {
  id: string;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  metadata?: Record<string, string> | null;
  mode?: string;
  payment_status?: "paid" | "unpaid" | "no_payment_required";
  status?: "open" | "complete" | "expired";
  url?: string | null;
};

export function cleanEnv(name: string): string {
  return (process.env[name] ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

export function getStripeSecretKey(): string {
  const key = cleanEnv("STRIPE_SECRET_KEY");
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return key;
}

export function getSaasCaseDbBetaPriceId(): string {
  const priceId = cleanEnv("STRIPE_SAAS_CASE_DB_BETA_PRICE_ID");
  if (!priceId) {
    throw new Error("STRIPE_SAAS_CASE_DB_BETA_PRICE_ID is not configured");
  }
  return priceId;
}

export async function stripeRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`Stripe API error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data as T;
}

export function getBaseUrl(req: Request): string {
  const configured = cleanEnv("NEXT_PUBLIC_SITE_URL") || cleanEnv("SITE_URL");
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
