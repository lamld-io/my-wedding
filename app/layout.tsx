import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Infant, Montserrat } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-script",
  display: "swap",
});

const cormorantInfant = Cormorant_Infant({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duy Lam & Thanh Thoảng | Thiệp Cưới",
  description:
    "Trân trọng kính mời bạn đến dự lễ thành hôn của Duy Lam và Thanh Thoảng vào ngày 11/04/2026 tại Ấp Tân An Chợ, Xã Tân An, Tỉnh Vĩnh Long.",
  keywords: [
    "thiệp cưới",
    "wedding invitation",
    "Duy Lam",
    "Thanh Thoảng",
    "đám cưới",
  ],
  openGraph: {
    title: "Duy Lam & Thanh Thoảng | Thiệp Cưới Online",
    description:
      "Trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi vào ngày 11/04/2026.",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/images/494A1302.jpg",
        width: 1200,
        height: 630,
        alt: "Duy Lam & Thanh Thoảng Wedding",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${greatVibes.variable} ${cormorantInfant.variable} ${montserrat.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
