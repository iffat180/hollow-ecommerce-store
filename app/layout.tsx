import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Roboto_Mono, Roboto_Slab, Roboto_Condensed, Roboto_Flex } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import ToastProvider from "@/components/ToastProvider";

// Roboto (main sans-serif)
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
});

// Roboto Mono (monospace - for code)
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto-mono",
  display: "swap",
});

// Roboto Slab (serif - for headings/emphasis)
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto-slab",
  display: "swap",
});

// Roboto Condensed (condensed sans-serif)
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

// Roboto Flex (variable font - optional, very flexible)
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hollow - Safety Meets Precision",
  description: "Premium safety gear certified to meet and exceed industry standards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`
        ${roboto.variable} 
        ${robotoMono.variable} 
        ${robotoSlab.variable} 
        ${robotoCondensed.variable}
        ${robotoFlex.variable}
      `}
    >
      <body>
        <CartProvider>
          <Navbar />
          <main className="mx-auto px-6 md:px-24 lg:px-48 xl:px-64 2xl:px-80 pt-2.5">
            {children}
          </main>
          <Footer />
          <ToastProvider />
        </CartProvider>
      </body>
    </html>
  );
}