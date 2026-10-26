import React from "react";

interface PhoneNumberProps {
  number: string;
  className?: string;
  separator?: string;
}

/**
 * Robust phone number parser ensuring area code (e.g., 061) is separated from subscriber digits.
 */
export function parsePhoneNumber(num: string) {
  if (!num) return { prefix: "", main: "" };
  const clean = num.replace(/[^\d]/g, "");

  // If already contains a dash (e.g. 061-53229528 or 0916-631-7609)
  if (num.includes("-")) {
    const parts = num.split("-");
    return { prefix: parts[0], main: parts.slice(1).join("-") };
  }

  // Khuzestan / Abadan landline (11 digits: 061 + 8 digits)
  if (clean.startsWith("061") && clean.length === 11) {
    return { prefix: "061", main: clean.slice(3) };
  }

  // Iranian Mobile (11 digits: 09xx + 7 digits)
  if (clean.startsWith("09") && clean.length === 11) {
    return { prefix: clean.slice(0, 4), main: clean.slice(4) };
  }

  return { prefix: "", main: num };
}

/**
 * PhoneNumber component:
 * 100% immune to RTL flipping and hyphen breaking.
 * Uses an LTR flex container where prefix (061) is the first child (left),
 * separator (-) is the middle child, and main digits (53229528) are the right child.
 * Bidi algorithms CANNOT reorder flex items, guaranteeing 061 stays on the left.
 * Uses the site's native Persian font (font-sans) with tabular-nums.
 */
export default function PhoneNumber({ number, className, separator = "-" }: PhoneNumberProps) {
  const { prefix, main } = parsePhoneNumber(number);

  if (!prefix) {
    return (
      <span
        dir="ltr"
        className={`inline-block [direction:ltr] [unicode-bidi:bidi-override] font-sans tabular-nums ${className || ""}`}
      >
        <bdo dir="ltr">{number}</bdo>
      </span>
    );
  }

  return (
    <span
      dir="ltr"
      className={`inline-flex items-center gap-0.5 [direction:ltr] [unicode-bidi:isolate] font-sans tabular-nums ${className || ""}`}
    >
      <bdo dir="ltr" className="[direction:ltr]">{prefix}</bdo>
      <span className="opacity-70 [direction:ltr] px-0.5">{separator}</span>
      <bdo dir="ltr" className="[direction:ltr] tracking-wide">{main}</bdo>
    </span>
  );
}
