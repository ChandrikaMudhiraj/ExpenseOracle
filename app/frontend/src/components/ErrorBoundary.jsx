import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--background)',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ marginBottom: '10px' }}>Something went wrong</h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
                        {this.state.error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
