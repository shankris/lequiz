"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function LayoutClient({ children }) {
  return (
    <>
      <Header />

      <div className='app-shell'>
        <main className='app-main'>{children}</main>
        <Footer />
      </div>
    </>
  );
}
