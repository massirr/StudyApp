import React from 'react';

interface AppShellProps {
    children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <div className="app-shell">
            <header className="app-header">
                <a className="app-home-link" href="/">
                    DP-750 Study App
                </a>
            </header>
            <main className="app-main">{children}</main>
        </div>
    );
};

export default AppShell;
