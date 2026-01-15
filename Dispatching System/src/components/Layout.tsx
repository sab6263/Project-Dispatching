import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-background text-textMain overflow-hidden font-sans">
            {children}
        </div>
    );
};
