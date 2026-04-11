import { useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { useWindowStore } from './store/windowStore';

function App() {
  const { openWindow } = useWindowStore();

  useEffect(() => {
    // Open a default welcome window
    openWindow('welcome-1', 'Welcome to WebOS', 'Welcome');
  }, [openWindow]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden text-black bg-black font-mono">
      <Desktop>
        {/* Render actual windows here later when WindowManager is implemented */}
      </Desktop>
      <Taskbar />
    </div>
  );
}

export default App;
