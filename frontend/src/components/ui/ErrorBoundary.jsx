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
            <h1 className="text-xl font-semibold text-white mb-2">
              Kuch galat ho gaya
            </h1>
            <p className="text-sm text-gray-500 mb-2">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-700 font-mono bg-bg-card rounded-lg p-3 mb-6 text-left">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500
                text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}