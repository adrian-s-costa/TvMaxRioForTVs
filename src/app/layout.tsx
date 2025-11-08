import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ClientLayout from './components/clientLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"], // or use `variable: "--font-poppins"` for variable font
  variable: "--font-poppins",
  display: "swap",
});

const APP_NAME = "TV Max Rio";
const APP_DEFAULT_TITLE = "TV Max Rio";
const APP_TITLE_TEMPLATE = "%s - TV Max Rio";
const APP_DESCRIPTION = "Descrição";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_DEFAULT_TITLE,
      // startUpImage: [],
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: APP_NAME,
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
    },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="touch-pan-y">
      <GoogleOAuthProvider clientId="157105380690-b5l5e6uqrn7ic0on112ag3t9rd399ip1.apps.googleusercontent.com">
      <body
        className={`${geistSans.variable} ${poppins.variable} antialiased bg-[#141414]`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <link rel="apple-touch-icon" href="/icons/icon-192.png"></link>
      </body>
      </GoogleOAuthProvider>
    </html>
  );
}
