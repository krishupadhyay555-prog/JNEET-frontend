// ============================================================
//  JNEET+ AI — components/ui/ErrorBoundary.jsx
//  Catches unexpected React render errors and shows a
//  graceful fallback with a Retry button.
// ============================================================

import { Component } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
    // A stale page chunk after a deploy: one automatic reload fixes it.
    if (/dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(String(error?.message))) {
      try {
        const last = Number(sessionStorage.getItem("jn_chunk_reload") || 0);
        if (Date.now() - last > 60_000) {
          sessionStorage.setItem("jn_chunk_reload", String(Date.now()));
          window.location.reload();
        }
      } catch { /* ignore */ }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionally reload the page
    if (this.props.resetOnRetry) window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl
              flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h1 className="text-xl font-semibold text-fg-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-fg-secondary mb-6">
              This page didn&apos;t load properly. Please try again — your work is saved.
            </p>
            {import.meta.env.DEV && this.state.error ? (
              <p className="text-xs text-gray-500 font-mono bg-bg-card rounded-lg p-3 mb-6 text-left">
                {this.state.error.message}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={this.handleReset}
                className="min-h-[44px] inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E]
                  text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
              >
                <RefreshCw size={14} />
                Try again
              </button>
              <a href="/dashboard"
                className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl border border-bg-border text-fg-primary text-sm font-medium hover:bg-bg-hover transition">
                Go to dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}