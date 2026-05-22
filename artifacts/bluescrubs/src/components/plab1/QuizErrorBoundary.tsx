import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
  onHome?: () => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class QuizErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error(
      `[QuizErrorBoundary] Error in ${this.props.context ?? 'quiz'}:`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center my-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
        <h3 className="font-medium text-rose-800 mb-1">
          Something went wrong
          {this.props.context ? ` in ${this.props.context}` : ''}
        </h3>
        <p className="text-sm text-rose-600 mb-4">
          This section couldn't load. Your progress is safe — you can continue or restart.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            size="sm"
            variant="outline"
            className="rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-100"
            onClick={this.handleReset}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try again
          </Button>
          {this.props.onHome && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-2xl border-rose-200 text-rose-700 hover:bg-rose-100"
              onClick={this.props.onHome}
            >
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Back to home
            </Button>
          )}
        </div>
      </div>
    );
  }
}
