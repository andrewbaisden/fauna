export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  if (!slug) {
    throw new Error(`Unable to generate slug from "${value}"`);
  }

  return slug;
}

export function canonicalCompareSlugs(
  slugA: string,
  slugB: string,
): [string, string] {
  return [slugA, slugB].sort((a, b) => a.localeCompare(b)) as [string, string];
}
