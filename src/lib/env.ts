function cleanUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return cleanUrl(value.trim());
}

export const SITE_URL = requirePublicEnv(
  "NEXT_PUBLIC_SITE_URL",
  process.env.NEXT_PUBLIC_SITE_URL
);

export const CMS_URL = requirePublicEnv(
  "NEXT_PUBLIC_CMS_URL",
  process.env.NEXT_PUBLIC_CMS_URL
);

export const PAYLOAD_API_URL = requirePublicEnv(
  "NEXT_PUBLIC_PAYLOAD_API",
  process.env.NEXT_PUBLIC_PAYLOAD_API
);