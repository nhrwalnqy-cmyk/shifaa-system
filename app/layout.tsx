import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "شفاء | منصة الرعاية الصحية الذكية",
  description: "احجز موعدك في أقرب مستشفى، وتابع دورك في الطابور لحظة بلحظة، دون انتظار في الممرات.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "شفاء",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A3733",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable} ${ibmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
