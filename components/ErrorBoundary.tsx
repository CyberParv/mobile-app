import React from "react";
import { ErrorView } from "@/components/ui/ErrorView";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, wire this to Sentry/Bugsnag.
    console.error("ErrorBoundary caught error:", error, info);
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorView message={this.state.error.message} onRetry={this.retry} />;
    }

    return this.props.children;
  }
}
