import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Farol PE — Observatório Socioeconômico",
      template: "%s · Farol PE",
    },
    description:
      "Indicadores oficiais e análises para orientar o desenvolvimento econômico de Pernambuco.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Farol PE",
      title: "Farol PE — Conhecer hoje. Decidir melhor.",
      description:
        "Inteligência de dados e análises para orientar políticas, investimentos e o desenvolvimento de Pernambuco.",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1731,
          height: 909,
          alt: "Farol PE — Conhecer hoje. Decidir melhor. Transformar amanhã.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Farol PE — Conhecer hoje. Decidir melhor.",
      description:
        "Inteligência de dados para o desenvolvimento de Pernambuco.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
