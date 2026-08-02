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

export const metadata: Metadata = {
  title: "The Little Mango Tree",
  description: "Inspired by your Fashion Sense",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
