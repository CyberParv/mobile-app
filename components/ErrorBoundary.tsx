import React from "react";
import { View } from "react-native";
import ErrorView from "./ui/ErrorView";

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App Error Boundary", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background">
          <ErrorView message="Something went wrong. Please try again." onRetry={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}
