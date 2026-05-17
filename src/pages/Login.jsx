import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ParticlesBackground } from '../components/ui/ParticlesBackground';

export default function Login() {
  const { signInWithGoogle, error, setError, online } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch {
      /* handled in context */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050810]">
      <ParticlesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 via-transparent to-[#a855f7]/5 pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f0ff]/10 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#a855f7]/10 blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-3xl p-8 neon-glow-cyan scanline relative overflow-hidden">
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="p-4 rounded-2xl bg-[#00f0ff]/10 mb-4"
            >
              <Shield className="w-12 h-12 text-[#00f0ff]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient-cyber mb-2">
              ThreatIntel Platform
            </h1>
            <p className="text-sm text-slate-400">
              Cross-Platform Cybersecurity Threat Intelligence Dashboard
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {['Real-time threat monitoring', 'AI-powered security analysis', 'Enterprise correlation engine'].map(
              (feat, i) => (
                <motion.div
                  key={feat}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                  {feat}
                </motion.div>
              )
            )}
          </div>

          {!online && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-sm text-[#fbbf24]">
              <WifiOff className="w-4 h-4 shrink-0" />
              You are offline. Connect to sign in.
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#ff3366]/10 border border-[#ff3366]/30 text-sm text-[#ff3366]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading || !online}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white text-[#050810] font-semibold text-sm hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-600 mt-6">
            Secured by Firebase Authentication · Enterprise-grade encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
