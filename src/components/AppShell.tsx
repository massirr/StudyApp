import React from 'react';
import { PixelLogo } from './common/PixelLogo';

interface AppShellProps {
    children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <div className="app-shell">
            <header className="app-header">
                <a className="app-home-link" href="/" aria-label="Home">
                    <PixelLogo scale={2} animated={false} showCursor={false} />
                </a>
            </header>
            <main className="app-main">{children}</main>
        </div>
    );
};

export default AppShell;
