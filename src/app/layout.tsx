import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-image-crop/dist/ReactCrop.css";
import BootstrapClient from "../components/BootstrapClient";
import localFont from "next/font/local";

import { GlobalContextProvider } from "../context/Store";
import { ToastContainer } from "react-toastify";

import Navbar from "../components/Navbar";

const timesNewRoman = localFont({
  src: [
    {
      path: "../../public/assets/fonts/times.ttf",
    },
  ],
  variable: "--font-timesNewRoman",
});
const kalpurush = localFont({
  src: [
    {
      path: "../../public/assets/fonts/kalpurush.ttf",
    },
  ],
  variable: "--font-kalpurush",
});
const algerian = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Algerian.ttf",
    },
  ],
  variable: "--font-algerian",
});
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": "https://tlmt.vercel.app/#business",

  name: "The Little Mango Tree",
  alternateName: "The Little Mango Tree boutique",

  url: "https://tlmt.vercel.app/",

  image: "https://tlmt.vercel.app/images/tlmt.jpg",

  description:
    "Ladies tailoring and boutique offering custom stitching, designer blouses, bridal wear, kurti stitching, salwar suits, designer gowns, kids wear, alterations and saree fall & pico.",

  slogan: "Where Every Stitch Tells Your Story",

  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.863911,
    longitude: 77.7711394,
  },

  hasMap:
    "https://www.google.com/maps/place/The+Little+Mango+Tree+boutique/@12.863911,77.7685645,17z",

  areaServed: {
    "@type": "Place",
    name: "Bengaluru",
  },

  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Custom Ladies Tailoring",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Designer Blouse Stitching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Kurti Stitching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Salwar Suit Stitching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Bridal Wear Stitching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Designer Gown Stitching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Dress Alteration",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Saree Fall & Pico",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "The Little Mango Tree",
  description: "Inspired by your Fashion Sense",
  verification: {
    google: "vQ_OuB0QvuO2I6sBHbH69UJPngQDel0g-KAAkNyrSmo",
  },
  keywords: [
    "The Little Mango Tree",
    "ladies tailoring",
    "ladies tailor",
    "women's tailoring",
    "boutique",
    "designer blouse",
    "blouse stitching",
    "kurti stitching",
    "salwar suit stitching",
    "bridal wear",
    "custom stitching",
    "dress alteration",
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://tlmt.vercel.app/",
  },

  openGraph: {
    title: "The Little Mango Tree | Ladies Tailoring & Boutique",
    description:
      "Elegant tailoring for women with perfect fitting, designer blouses, kurtis, bridal wear, alterations and custom stitching.",
    url: "https://tlmt.vercel.app/",
    siteName: "The Little Mango Tree",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${kalpurush.variable} ${timesNewRoman.variable} ${algerian.variable}`}
        suppressHydrationWarning={true}
        lang="en"
        data-scroll-behavior="smooth"
      >
        <GlobalContextProvider>
          <Navbar />
          <div>{children}</div>
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
          />
          <BootstrapClient />
        </GlobalContextProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </body>
    </html>
  );
}
