import React, { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';
import FleetSyncMatchmaking from './FleetSyncMatchmaking';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

              {/* 1. ROTA DA HOME INSTITUCIONAL */}
              <Route
                path="/"
                element={
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
                    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                  </div>
                }
              />

              {/* 2. ROTA DE CADASTRO */}
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

              {/* 3. ROTA DO DASHBOARD ANALÍTICO */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* 4. ROTA DO MATCHMAKING (TINDER LOGÍSTICO) - ADICIONADA! */}
              <Route path="/matchmaking" element={<FleetSyncMatchmaking />} />

              {/* Rota de segurança */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
    </BrowserRouter>
  );
}