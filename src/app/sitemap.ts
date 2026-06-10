import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.greencyclesentinel.com";
  
  const routes = [
    "",
    "/technology",
    "/products",
    "/research",
    "/sustainability",
    "/achievements",
    "/about",
    "/contact",
    "/report-waste",
    "/login",
    "/register",
    "/otp-verification",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
