import React from 'react';
import { Phone, Map, Settings, LogOut, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeWorkspace: 'A' | 'B' | 'C' | 'D';
    onWorkspaceChange: (workspace: 'A' | 'B' | 'C' | 'D') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeWorkspace, onWorkspaceChange }) => {
    const navItems = [
        { id: 'A', label: 'Emergency', icon: Phone, description: 'Call Taking' },
        { id: 'D', label: 'Map', icon: Map, description: 'Live Map' },
    ] as const;

    const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, id: string } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, id });
    };

    const handleDetach = () => {
        if (!contextMenu) return;
        const width = 1200;
        const height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        window.open(
            `${window.location.origin}?mode=detached&detached=true&workspace=${contextMenu.id}`,
            `_blank_${contextMenu.id}`,
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
        );

        // Auto-switch main window if we detached the active view
        if (contextMenu.id === activeWorkspace) {
            const otherItem = navItems.find(item => item.id !== contextMenu.id);
            if (otherItem) {
                // @ts-ignore
                onWorkspaceChange(otherItem.id);
            }
        }

        setContextMenu(null);
    };

    // Close menu on click elsewhere
    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="flex flex-col h-screen w-20 bg-surface border-r border-border items-center py-6 gap-8 relative">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <Bell className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onWorkspaceChange(item.id)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group relative select-none",
                            activeWorkspace === item.id
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-textMuted hover:bg-surfaceHighlight hover:text-white"
                        )}
                        title={item.description}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>

                        {/* Active Indicator */}
                        {activeWorkspace === item.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-[9999] bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl py-1 w-40 animate-in fade-in zoom-in-95 duration-100"
                    style={{ left: 60, top: contextMenu.y }}
                >
                    <button
                        onClick={handleDetach}
                        className="w-full text-left px-3 py-2 text-sm text-stone-200 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4 rotate-180" />
                        <span>Open in new window</span>
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4 w-full px-2">
                <button className="p-3 text-textMuted hover:text-white hover:bg-surfaceHighlight rounded-xl flex justify-center">
                    <Settings className="w-6 h-6" />
                </button>
                <button className="p-3 text-textMuted hover:text-danger hover:bg-danger/10 rounded-xl flex justify-center">
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
