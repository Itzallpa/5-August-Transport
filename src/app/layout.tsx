import type { Metadata, Viewport } from "next";
import { Kanit, Inter } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-kanit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D32F2F",
};

export const metadata: Metadata = {
  title: "5 August Transport | บริษัท 5 สิงหา ทรานสปอร์ต จำกัด - บริการขนส่งและโลจิสติกส์ครบวงจร",
  description:
    "ทุกเส้นทาง เราพร้อมส่งต่อความมั่นใจ - บริการขนส่งสินค้าและโลจิสติกส์ ครบวงจร สำหรับธุรกิจของคุณ กองยานพาหนะ 4 ล้อ, 6 ล้อ, 10 ล้อ, เทรลเลอร์ และหัวลากคอนเทนเนอร์ 20/40 FT ทั่วประเทศไทย โทร 084-326-3546",
  keywords: [
    "5 August Transport",
    "5 สิงหา ทรานสปอร์ต",
    "ขนส่งสินค้า",
    "โลจิสติกส์",
    "รถบรรทุกรับจ้าง",
    "4 ล้อ ตู้ทึบ",
    "6 ล้อ จัมโบ้",
    "10 ล้อ",
    "รถเทรลเลอร์",
    "หัวลากคอนเทนเนอร์",
    "สมัครงานขับรถ",
    "KEX",
  ],
  authors: [{ name: "5 August Transport Company Limited" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${kanit.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#D32F2F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
