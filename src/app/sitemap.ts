import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { getAllSlugs } from "@/server/species";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [species, habitats, taxa] = await Promise.all([
    getAllSlugs(),
    prisma.habitat.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.taxon.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/animals`, lastModified: new Date() },
    ...species.map((item) => ({
      url: `${base}/animals/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...habitats.map((item) => ({
      url: `${base}/habitats/${item.slug}`,
      lastModified: item.updatedAt,
    })),
    ...taxa.map((item) => ({
      url: `${base}/taxonomy/${item.slug}`,
      lastModified: item.updatedAt,
    })),
  ];
}
