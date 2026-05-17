import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { useThreatData } from '../hooks/useThreatData';
import { askSecurityAssistant } from '../services/aiAssistant';
import { GlassCard } from '../components/ui/GlassCard';

const SUGGESTIONS = [
  'Why is server-3 risky?',
  'What is our current risk score?',
  'How do we respond to ransomware threats?',
  'Analyze credential attack patterns',
];

function formatMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={i} className="text-sm font-semibold text-[#00f0ff] mt-3 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="text-xs font-semibold text-white mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="text-xs text-slate-300 ml-4 list-disc">
            {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      if (line.trim()) {
        return (
          <p key={i} className="text-xs text-slate-300 leading-relaxed">
            {line.replace(/\*\*(.*?)\*\*/g, (_, b) => b)}
          </p>
        );
      }
      return null;
    });
}

export default function AIAssistant() {
  const threatData = useThreatData();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "I'm your AI Security Assistant. Ask me about asset risk, threats, or remediation strategies.",
      source: 'system',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    setFallbackNotice(null);

    try {
      const response = await askSecurityAssistant(question, threatData);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.content,
          source: response.source,
        },
      ]);
      if (response.fallback) {
        setFallbackNotice(response.fallbackReason);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I encountered an error but remain operational. Please try again or rephrase your question.',
          source: 'error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {fallbackNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-xs text-[#fbbf24]"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {fallbackNotice}
        </motion.div>
      )}

      <GlassCard className="flex-1 flex flex-col min-h-0 mb-4" hover={false}>
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#1a2744]">
          <div className="p-2 rounded-xl bg-[#a855f7]/20">
            <Bot className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Security AI Assistant</h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00f0ff]" />
              Powered by threat intelligence engine
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/25 text-white'
                      : 'bg-[#0a0f1a] border border-[#1a2744] text-slate-300'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="space-y-1">{formatMarkdown(msg.content)}</div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  {msg.source && msg.role === 'assistant' && msg.source !== 'system' && (
                    <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-wider">
                      via {msg.source}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
              Analyzing threat data...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => sendMessage(s)}
            disabled={loading}
            className="text-[10px] px-3 py-1.5 rounded-full border border-[#1a2744] text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/30 transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about threats, assets, or remediation..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-[#0d1424] border border-[#1a2744] text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#00f0ff]/40 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-3 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 disabled:opacity-40 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
