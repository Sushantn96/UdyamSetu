import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-xl border border-slate-200 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Application Notice / पोर्टल सूचना
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                An unexpected display issue occurred. You can safely reload the page to restore your session.
              </p>
            </div>
            {this.state.error && (
              <div className="text-[11px] font-mono text-left bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600 overflow-x-auto max-h-24">
                {this.state.error.message || 'Script error'}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Portal / पोर्टल पुनः लोड करें</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
