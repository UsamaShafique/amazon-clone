import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/orders", "/cart", "/wishlist", "/api/"],
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
