import { useState } from 'react';
import { CADProvider } from './context/CADContext';
import { Sidebar } from './components/Sidebar';
import { Layout } from './components/Layout';
// Placeholders for now
import { CallTakingView } from './components/call-taking/CallTakingView';

import { SituationalAwarenessView } from './components/situational-awareness/SituationalAwarenessView';

import { DispatchingView } from './components/dispatching/DispatchingView';
import { MapView } from './components/map/MapView';

function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<'A' | 'B' | 'C' | 'D'>('A');

  return (
    <CADProvider>
      <Layout>
        <Sidebar activeWorkspace={activeWorkspace} onWorkspaceChange={setActiveWorkspace} />
        <main className="flex-1 relative overflow-auto">
          {activeWorkspace === 'A' && <CallTakingView />}
          {activeWorkspace === 'B' && <SituationalAwarenessView />}
          {activeWorkspace === 'C' && <DispatchingView />}
          {activeWorkspace === 'D' && <MapView />}

          {/* Version Badge Removed as requested */}
        </main>
      </Layout>
    </CADProvider>
  );
}

export default App;
