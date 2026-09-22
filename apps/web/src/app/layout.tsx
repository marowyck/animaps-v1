import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import { SmoothScrollProvider } from "./providers";
import "./globals.css";

const baloo = Baloo_2({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const nunito = Nunito_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANIMAPS — pessoas, animais e lugares",
  description:
    "Conecte pessoas, animais e lugares. Adoção, ocorrências, organizações e instituições no mesmo mapa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="font-sans flex min-h-full flex-col overflow-x-clip bg-background text-body text-text">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
