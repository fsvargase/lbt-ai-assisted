// Public, build-time-inlined env values safe to read from Client Components.
// Only NEXT_PUBLIC_* keys belong here; never expose server secrets.
export const recaptchaSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
