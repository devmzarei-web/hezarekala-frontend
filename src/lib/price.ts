/**
 * price.ts
 * Pricing and commercial formatting utilities for HezarehKala Industrial Catalog.
 */

export function formatPriceNumber(price?: number | null): string {
  if (price === undefined || price === null || isNaN(price) || price <= 0) return "";
  return price.toLocaleString("fa-IR");
}

export function formatPriceWithUnit(
  price?: number | null,
  unit?: "toman" | "rial" | "usd" | string | null
): string {
  if (price === undefined || price === null || isNaN(price) || price <= 0) return "";
  const formattedNumber = formatPriceNumber(price);
  let unitLabel = "تومان";
  if (unit === "rial") unitLabel = "ریال";
  else if (unit === "usd") unitLabel = "دلار";

  return `${formattedNumber} ${unitLabel}`;
}

export function isPriceAvailable(product?: {
  price?: number | null;
  callForPrice?: boolean | null;
} | null): boolean {
  if (!product) return false;
  if (product.callForPrice) return false;
  return typeof product.price === "number" && product.price > 0;
}
