import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.greencyclesentinel.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/otp-verification",
        "/report-waste",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
