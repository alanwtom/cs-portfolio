"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you might want to report this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  private handleReload = () => {
    // Reset error state and reload the page
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  private handleReset = () => {
    // Just reset the error state without reloading
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-md w-full p-6 text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We're sorry, but something unexpected happened. This error has
                been logged and we'll work to fix it.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap text-xs text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button onClick={this.handleReload} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
