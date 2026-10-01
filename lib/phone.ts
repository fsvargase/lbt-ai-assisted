/**
 * US phone normalization to E.164 (+1XXXXXXXXXX).
 * US-only by design, consistent with NYC-centric operations.
 */

/** Returns the E.164 US phone (`+1XXXXXXXXXX`) or `null` when invalid. */
export function normalizeUsPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  let national: string;
  if (digits.length === 10) {
    national = digits;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    national = digits.slice(1);
  } else {
    return null;
  }

  // US NANP: area code and exchange code cannot start with 0 or 1.
  if (/^[01]/.test(national) || /^[01]/.test(national.slice(3))) {
    return null;
  }

  return `+1${national}`;
}

export function isValidUsPhone(raw: string): boolean {
  return normalizeUsPhone(raw) !== null;
}
