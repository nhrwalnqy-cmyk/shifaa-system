"use client";

import React, { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!);
      }

      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-danger" />
            </div>
            <h2 className="text-lg font-bold text-teal-950 mb-2">حدث خطأ ما</h2>
            <p className="text-sm text-slate-600 mb-4">
              {this.state.error?.message || "حدث خطأ غير متوقع. يرجى محاولة تحديث الصفحة."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-900 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
