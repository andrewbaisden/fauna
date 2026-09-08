/** Public site origin for metadata, sitemap, and robots. Safe during build. */
export function getSiteUrl(): string {
  const explicit = process.env.BETTER_AUTH_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  }

  return "http://localhost:3000";
}
