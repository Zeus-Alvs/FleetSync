import React, { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="bg-grafite text-white font-sans antialiased selection:bg-amareloLog selection:text-black">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <main>
        <Hero />
        <About />
        <Features />
        <Team />
        <Contact />
      </main>
      <Footer />

      {/* Modal de Login Rápido */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}