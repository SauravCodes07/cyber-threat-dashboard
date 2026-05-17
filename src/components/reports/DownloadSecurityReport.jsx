import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThreatData } from '../../hooks/useThreatData';
import { generateSecurityReport } from '../../services/securityReportPdf';
import { ToastContainer } from '../ui/Toast';

let toastId = 0;

export function DownloadSecurityReport({ className = '', compact = false }) {
  const { user } = useAuth();
  const threatData = useThreatData();
  const [generating, setGenerating] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleDownload = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const filename = await Promise.resolve().then(() =>
        generateSecurityReport(user, threatData)
      );
      showToast(`Security report downloaded: ${filename}`, 'success');
    } catch {
      showToast('Failed to generate PDF report. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleDownload}
        disabled={generating || threatData.loading}
        whileHover={{ scale: generating ? 1 : 1.02 }}
        whileTap={{ scale: generating ? 1 : 0.98 }}
        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          compact
            ? 'px-3 py-2'
            : 'px-4 py-2.5 sm:px-5 sm:py-3 w-full sm:w-auto'
        } ${className}`}
        style={{
          background: 'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(168,85,247,0.15) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: generating
            ? 'none'
            : '0 0 24px rgba(0, 240, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/0 via-[#00f0ff]/10 to-[#00f0ff]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
          aria-hidden="true"
        />
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 text-[#00f0ff] animate-spin relative z-10" />
            <span className="text-[#00f0ff] relative z-10">Generating PDF...</span>
          </>
        ) : (
          <>
            {compact ? (
              <FileDown className="w-4 h-4 text-[#00f0ff] relative z-10" />
            ) : (
              <>
                <Shield className="w-4 h-4 text-[#00f0ff] relative z-10 hidden sm:block" />
                <FileDown className="w-4 h-4 text-[#00f0ff] relative z-10 sm:hidden" />
                <span className="text-white relative z-10">Download Security Report</span>
              </>
            )}
          </>
        )}
      </motion.button>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export function ReportExportBar({ title, subtitle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 rounded-2xl glass border border-[#00f0ff]/15">
      <div className="min-w-0">
        {title && (
          <p className="text-xs text-[#00f0ff] uppercase tracking-wider font-semibold mb-0.5">
            Export
          </p>
        )}
        <p className="text-sm text-slate-300">
          {subtitle || 'Generate an enterprise PDF with threat summary, intelligence, and remediation.'}
        </p>
      </div>
      <DownloadSecurityReport className="shrink-0" />
    </div>
  );
}
