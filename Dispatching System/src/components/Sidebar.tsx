import React from 'react';
import { Phone, Map, Settings, LogOut, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    activeWorkspace: 'A' | 'B' | 'C' | 'D';
    onWorkspaceChange: (workspace: 'A' | 'B' | 'C' | 'D') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeWorkspace, onWorkspaceChange }) => {
    const navItems = [
        { id: 'A', label: 'Notruf', icon: Phone, description: 'Call Taking' },
        { id: 'D', label: 'Map', icon: Map, description: 'Live Map' },
    ] as const;

    return (
        <div className="flex flex-col h-screen w-20 bg-surface border-r border-border items-center py-6 gap-8">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <Bell className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onWorkspaceChange(item.id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group relative",
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
