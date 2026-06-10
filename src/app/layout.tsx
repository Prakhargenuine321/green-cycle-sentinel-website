import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationHeader } from "@/components/navigation-header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Green Cycle Sentinel | Circular Energy & Sustainable Technology",
  description: "Investor-grade green-energy tech, waste-to-energy systems, smart collection, and advanced AQI air purification systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Green Cycle Sentinel",
                "url": "https://www.greencyclesentinel.com",
                "logo": "https://www.greencyclesentinel.com/logo.png",
                "description": "Green Cycle Sentinel is a green-energy technology startup focused on waste-to-energy technology, smart collection ecosystems, air purification, and AQI monitoring networks.",
                "sameAs": [
                  "https://www.linkedin.com/company/green-cycle-sentinel",
                  "https://twitter.com/gcsentinel"
                ]
              })
            }}
          />
          <NavigationHeader />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
