import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/my-fauna", "/api/auth", "/api/favourites"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
