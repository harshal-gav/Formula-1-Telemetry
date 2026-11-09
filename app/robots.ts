import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexpulse.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/races", "/drivers", "/standings", "/pricing", "/pro", "/dashboard"],
        disallow: ["/api/", "/account", "/login", "/signup"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
