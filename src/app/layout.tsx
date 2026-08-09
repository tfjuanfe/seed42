import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Seed42 — Aprende IA haciendo",
    template: "%s · Seed42",
  },
  description:
    "Plataforma gratuita para aprender inteligencia artificial con ejercicios interactivos, en español y desde el navegador.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D0D12" },
    { media: "(prefers-color-scheme: light)", color: "#F2F2F6" },
  ],
};

// Runs before paint: applies the stored theme (dark is the default and
// needs no attribute) so the page never flashes the wrong theme.
const themeInitScript = `
try {
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
