import React from 'react';

export default function Contact() {
  return (
    <section id="contato" className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-white">
      {/* Formulário */}
      <div className="bg-zinc-950 p-8 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-2xl font-bold">Envie uma <span className="text-amber-500">Mensagem</span></h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Seu Nome" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
            <input type="email" placeholder="Seu E-mail" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Telefone" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
            <input type="text" placeholder="Empresa" className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <textarea rows="4" placeholder="Sua Mensagem..." className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-amber-500" />
          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded hover:bg-amber-400 transition-colors">
            Enviar Solicitação
          </button>
        </form>
      </div>

      {/* Informações Institucionais */}
      <div className="flex flex-col justify-center space-y-8 lg:pl-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight">Fale Conosco</h3>
          <p className="text-zinc-400 text-sm">Nossa equipe de suporte e implantação está pronta para atender sua transportadora.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 📞 Telefone de Contato</p>
              <p className="text-sm text-zinc-400">0800 555 SYNC (7962)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 📍 Localização</p>
              <p className="text-sm text-zinc-400">FATEC - Complexo Tecnológico de Logística</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-semibold text-white"> 🕒Horário de Atendimento</p>
              <p className="text-sm text-zinc-400">Segunda a Sexta, das 08h às 22h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}