import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050810] p-6 grid-bg">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center neon-glow-red scanline relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff3366] to-transparent" />
            <AlertTriangle className="w-12 h-12 text-[#ff3366] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">System Interruption</h2>
            <p className="text-slate-400 text-sm mb-2">
              The security dashboard encountered an unexpected error.
            </p>
            {import.meta.env.DEV && this.state.error?.message && (
              <p className="text-[10px] text-slate-600 font-mono mb-4 break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 border border-[#1a2744] hover:bg-white/10 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
