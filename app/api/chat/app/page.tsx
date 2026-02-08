"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiImage, FiArrowRight, FiGithub, FiInstagram } from "react-icons/fi";

export default function Home() {
  const [isChatting, setIsChatting] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{role: string, text: string, img?: string}[]>([]);
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const LOGO = "https://autoresbot.com/tmp_files/7f9a5a8b-3675-4e5c-91fa-c43a013f6ed5.jpg";

  const handleSend = async () => {
    if (!input && !img) return;
    setLoading(true);
    setChat([...chat, { role: "user", text: input, img: img || undefined }]);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: input, image: img }),
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "ai", text: data.response }]);
    } catch {
      setChat(prev => [...prev, { role: "ai", text: "Aduh, server lagi pusing nih!" }]);
    } finally {
      setInput(""); setImg(null); setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {!isChatting ? (
          /* --- HALAMAN PROFIL / LANDING --- */
          <motion.div 
            key="profile"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-white blur-3xl opacity-20 animate-pulse"></div>
              <img src={LOGO} className="w-32 h-32 rounded-full border-4 border-white relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
            </motion.div>

            <motion.h1 initial={{ y: 20 }} animate={{ y: 0 }} className="text-6xl font-black italic tracking-tighter mb-4">XYZ AI</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-400 max-w-sm mb-10 leading-relaxed">
              Masa depan ada di sini. Teman AI yang cerdas, asik, dan siap bantu apa aja lewat teks atau foto.
            </motion.p>

            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatting(true)}
              className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 text-lg shadow-white/20 shadow-xl"
            >
              Mulai Ngobrol <FiArrowRight />
            </motion.button>

            <div className="mt-20 flex gap-6 text-zinc-600">
              <FiGithub size={24} /> <FiInstagram size={24} />
            </div>
          </motion.div>
        ) : (
          /* --- HALAMAN CHAT --- */
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-screen"
          >
            <header className="p-4 border-b border-zinc-900 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <img src={LOGO} className="w-10 h-10 rounded-full border border-zinc-700" />
                <span className="font-black tracking-widest uppercase text-sm">XYZ CORE</span>
              </div>
              <button onClick={() => setIsChatting(false)} className="text-xs text-zinc-500 hover:text-white transition underline">BACK</button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-28">
              {chat.length === 0 && (
                <div className="text-center text-zinc-700 mt-20 italic">Belum ada pesan. Sapa XYZ dong!</div>
              )}
              {chat.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800'}`}>
                    {m.img && <img src={m.img} className="w-full rounded-2xl mb-3 border border-zinc-700" />}
                    <p className="text-[15px] leading-relaxed font-medium">{m.text}</p>
                  </div>
                </motion.div>
              ))}
              {loading && <div className="text-xs text-zinc-500 font-mono flex items-center gap-2"><div className="w-1 h-1 bg-white animate-bounce"></div> XYZ lagi mikir...</div>}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
              <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-3xl flex items-center gap-2 shadow-2xl backdrop-blur-md">
                  <label className="p-3 text-zinc-400 cursor-pointer hover:text-white transition">
                    <FiImage size={24} />
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      const reader = new FileReader();
                      reader.onload = () => setImg(reader.result as string);
                      reader.readAsDataURL(e.target.files![0]);
                    }} />
                  </label>
                  <input 
                    className="flex-1 bg-transparent outline-none p-2 text-[15px]" 
                    placeholder="Ketik pesan..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={handleSend} className="bg-white text-black p-4 rounded-2xl hover:bg-zinc-200 active:scale-90 transition">
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
              }
