import type { Metadata } from "next";
import { Alfa_Slab_One, Karla, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const alfa = Alfa_Slab_One({
  variable: "--font-alfa",
  weight: "400",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chivo Radar",
  description:
    "El radar de la música en vivo en Costa Rica. Del garaje al estadio, encontrá tu próximo chivo en el mapa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${alfa.variable} ${karla.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}