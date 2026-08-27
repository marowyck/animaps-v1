import type { Metadata } from "next";
import { Bagel_Fat_One, Nunito } from "next/font/google";
import { SmoothScrollProvider } from "./providers";
import "./globals.css";

const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bagel",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIMAPS — Match ideal para adoção responsável",
  description:
    "Plataforma de adoção responsável e mapa de ocorrências. Crie sua conta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bagelFatOne.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="font-sans flex min-h-full flex-col overflow-x-clip bg-gray-soft text-base leading-relaxed text-ink">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
