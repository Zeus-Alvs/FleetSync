import React, { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Seus componentes originais
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/modals/LoginModal';
import Cadastro from './Cadastro'; 

// O seu componente de Dashboard
import Dashboard from './Dashboard'; 

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. ROTA DA HOME INSTITUCIONAL (Com a sua Navbar, Hero, etc.) */}
        <Route 
          path="/" 
          element={
            <div className="bg-grafite text-white font-sans antialiased selection:bg-amareloLog selection:text-black">
              {/* Note que removemos o onNavigate e o currentScreen daqui, pois o React Router cuida disso agora */}
              <Navbar onLoginClick={() => setIsLoginOpen(true)} />
              <main>
                <Hero />
                <About />
                <Features />
                <Team />
                <Contact />
              </main>
              <Footer />
              <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
          } 
        />

        {/* 2. ROTA DE CADASTRO: Acessível por http://localhost:5173/cadastro */}
        <Route 
          path="/cadastro" 
          element={
            <div className="bg-grafite text-white font-sans antialiased selection:bg-amareloLog selection:text-black">
              <Navbar onLoginClick={() => setIsLoginOpen(true)} />
              <main>
                <Cadastro />
              </main>
              <Footer />
              <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>
          } 
        />

        {/* 3. A SUA ROTA DO DASHBOARD: Acessível por http://localhost:5173/dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rota de segurança: se digitar qualquer coisa errada, volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}