import { useDesktopStore } from '../store/desktopStore';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { AppWindow } from './AppWindow';

export const Desktop = () => {
  const { closeStartMenu } = useDesktopStore();

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-cover bg-center select-none"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=3870&auto=format&fit=crop")',
      }}
    >
      {/* Click interceptor to close start menu when clicking on desktop */}
      <div className="absolute inset-0" onClick={closeStartMenu} />

      {/* App Windows */}
      <AppWindow />

      {/* Start Menu */}
      <StartMenu />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
