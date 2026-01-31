import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Riverlands | Discover the Heart of Illinois",
    template: "%s | Riverlands",
  },
  description:
    "Explore the historic river counties of western Illinois. Discover events, local businesses, historic landmarks, and natural beauty across Adams, Pike, Brown, Schuyler, Calhoun, Scott, and Morgan counties.",
  keywords: [
    "Illinois tourism",
    "western Illinois",
    "river counties",
    "Quincy Illinois",
    "Pittsfield Illinois",
    "historic sites",
    "Mississippi River",
    "Illinois River",
    "Adams County",
    "Pike County",
    "local events",
    "travel Illinois",
  ],
  openGraph: {
    title: "Riverlands | Discover the Heart of Illinois",
    description:
      "Explore the historic river counties of western Illinois. Events, history, local businesses, and natural beauty.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
