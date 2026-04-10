import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rh-page">
          <div className="rh-page__inner">
            <h1 className="rh-title">Something went wrong</h1>
            <p className="rh-subtitle">Try refreshing the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
