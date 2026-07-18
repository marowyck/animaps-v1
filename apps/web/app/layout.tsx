import type { Metadata } from "next";
import { Sour_Gummy, Oi } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  variable: "--font-sour-gummy",
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

const oiFont = Oi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIMAPS — Match ideal para adoção responsável",
  description:
    "Plataforma de adoção responsável e mapa de ocorrências. Entre na lista de espera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sourGummy.variable} ${oiFont.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-gray-soft text-ink overflow-x-hidden">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
