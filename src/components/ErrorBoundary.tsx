import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isResetting: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
    isResetting: false
  };

  private retryTimeout: NodeJS.Timeout | null = null;

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Prevent infinite error loops
    if (this.state.retryCount >= (this.props.maxRetries || 3)) {
      console.error('Maximum retry attempts reached');
      return;
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      retryCount: prevState.retryCount + 1
    }));

    // Call error callback if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    }

    // Log error
    console.error('Uncaught error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  public componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private handleReset = async () => {
    this.setState({ isResetting: true });

    try {
      if (this.props.onReset) {
        await Promise.resolve(this.props.onReset());
      }

      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isResetting: false,
        retryCount: 0
      });
    } catch (resetError) {
      console.error('Reset failed:', resetError);
      this.setState({ isResetting: false });

      // Fallback to page reload after brief delay
      this.retryTimeout = setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  private getErrorMessage(): string {
    if (!this.state.error) {
      return 'An unexpected error occurred. Please try refreshing the page.';
    }

    // Handle specific error types
    if (this.state.error instanceof TypeError) {
      return 'A type error occurred. This might be due to unexpected data.';
    }

    if (this.state.error instanceof ReferenceError) {
      return 'A reference error occurred. Some required data might be missing.';
    }

    return this.state.error.message || 'An unexpected error occurred. Please try refreshing the page.';
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.getErrorMessage();
      const showRetryButton = this.state.retryCount < (this.props.maxRetries || 3);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              {errorMessage}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto text-xs text-gray-800 dark:text-gray-200 mb-6">
                <code>{this.state.errorInfo.componentStack}</code>
              </pre>
            )}
            <div className="flex flex-col items-center gap-4">
              {showRetryButton && (
                <button
                  onClick={this.handleReset}
                  disabled={this.state.isResetting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors flex items-center gap-2 disabled:opacity-50 
                           disabled:cursor-not-allowed"
                >
                  {this.state.isResetting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </>
                  )}
                </button>
              )}
              {!showRetryButton && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  Maximum retry attempts reached. Please refresh the page.
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Retry attempt {this.state.retryCount} of {this.props.maxRetries || 3}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}