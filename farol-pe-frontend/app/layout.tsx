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
      default: "FarolPE",
      template: "%s · FarolPE",
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
      siteName: "FarolPE",
      title: "FarolPE",
      description:
        "O farol sobre os dados de Pernambuco para orientar gestores, pesquisadores e investidores.",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1734,
          height: 907,
          alt: "FarolPE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "FarolPE",
      description:
        "O farol sobre os dados de Pernambuco para orientar gestores, pesquisadores e investidores.",
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
