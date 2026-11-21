
import React, { useEffect, useState } from "react";
import { auth, loginWithEmail } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, Database, Sparkles, User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/admin");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      await loginWithEmail(username, password);
      navigate("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("INVALID CREDENTIALS: Check capitalization and special characters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-display tracking-widest uppercase text-[10px]">
      Synchronizing Access...
    </div>
  );

  const consoleLink = "https://console.firebase.google.com/project/prontomedical-1727183042674/authentication/providers";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/40 backdrop-blur-3xl p-10 border border-white/10 text-center max-w-sm w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 text-white/40">
            <Lock className="w-6 h-6" />
          </div>
          
          <p className="text-[8px] uppercase tracking-[0.5em] text-white/40 mb-2 font-bold">Curator Access</p>
          <h1 className="text-3xl font-display font-black tracking-tighter text-white mb-8 uppercase italic">SIGN IN</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                type="text"
                placeholder="USERNAME"
                className="w-full bg-black/50 border border-white/10 p-4 pl-12 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                className="w-full bg-black/50 border border-white/10 p-4 pl-12 pr-12 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] tracking-widest font-bold text-left"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span className="uppercase">{error.split(':')[0]}</span>
                </div>
                {error.includes(':') && (
                   <div className="text-white/60 lowercase font-medium tracking-normal text-[11px] first-letter:uppercase">
                      {error.split(':')[1].trim()}
                      {error.includes('Email/Password') && (
                        <a href={consoleLink} target="_blank" rel="noopener noreferrer" className="block mt-2 text-white underline hover:text-red-400 transition-colors">
                          Enable Provider in Console {'->'}
                        </a>
                      )}
                   </div>
                )}
              </motion.div>
            )}
            
            <div className="pt-2 space-y-3">
              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Authenticating..."
                ) : (
                  <>
                    Enter Dashboard
                    <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-4 border border-white/10 text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                Return to Site
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <span className="text-[8px] uppercase tracking-widest text-white/20 leading-relaxed max-w-[180px]">
              Access restricted to the primary exhibit curator.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
