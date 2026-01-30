import React from "react";
import { Header } from "../components/landing/header/header";
import { Home } from "../components/landing/home/home";
import { Features } from "../components/landing/features/features";
import { FAQ } from "../components/landing/faq/faq";
import { Footer } from "../components/landing/footer/footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main>
        <Home />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
