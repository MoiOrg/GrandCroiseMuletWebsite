import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../src/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Le Grand Croise Mulet - Inscription",
  description: "Participez au trail événementiel et mesurez-vous aux autres clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}