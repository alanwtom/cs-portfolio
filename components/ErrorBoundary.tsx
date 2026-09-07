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
      // Budget: 3 sizes (24 / 16 / 12), 2 weights (500, 400). Same palette
      // tokens and 24px surface as everything else —
      // this used to be hardcoded grays that ignored the site's theme.
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-inset">
          <Card className="w-full max-w-md space-y-6 p-inset text-center">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="type-title text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="type-body text-muted-foreground">
                We&apos;re sorry, but something unexpected happened. This error
                has been logged and we&apos;ll work to fix it.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="rounded-md bg-secondary p-inset-sm text-left">
                <summary className="type-micro mb-2 cursor-pointer text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="type-micro whitespace-pre-wrap normal-case tracking-normal text-destructive">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button onClick={this.handleReload} className="flex-1">
                <RefreshCw className="h-4 w-4" />
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
