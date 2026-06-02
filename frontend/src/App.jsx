import React, { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cadastro from './Cadastro';
import Login from './Login';
import Dashboard from './dashboard';
import FleetSyncMatchmaking from './FleetSyncMatchmaking';
import Administracao from './administracao';
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === ROTAS PÚBLICAS === */}
          {/* 1. ROTA DA HOME INSTITUCIONAL */}
          <Route
            path="/"
            element={
              <div className="bg-grafite text-white font-sans antialiased selection:bg-amareloLog selection:text-black">
                <Navbar />
                <main>
                  <Hero />
                  <About />
                  <Features />
                  <Team />
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />
          {/* 2. ROTAS DE AUTENTICAÇÃO LIMPAS (Split Screen) */}
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          {/* === ROTAS PROTEGIDAS === */}
          {/* O ProtectedRoute atua como um "escudo" para as rotas filhas */}
          <Route element={<ProtectedRoute />}>
            {/* 3. ROTA DO DASHBOARD ANALÍTICO */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 4. ROTA DO MATCHMAKING (TINDER LOGÍSTICO) */}
            <Route path="/matchmaking" element={<FleetSyncMatchmaking />} />
            {/* 5. ROTA DE ADMINISTRAÇÃO */}
            <Route path="/administracao" element={<Administracao />} />
          </Route>
          {/* Rota de segurança padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}