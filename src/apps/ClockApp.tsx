import { useState, useEffect } from 'react';
import { Clock as ClockIcon, Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const ClockApp = () => {
  const [activeTab, setActiveTab] = useState('clock');
  const [time, setTime] = useState(new Date());
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'clock', name: 'World Clock', icon: ClockIcon },
    { id: 'stopwatch', name: 'Stopwatch', icon: Timer },
  ];

  return (
    <div className="flex h-full bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100 border-r border-gray-200 flex flex-col p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-4 px-2">Clock</h2>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        {activeTab === 'clock' ? (
          <div className="text-center space-y-4">
            <div className="text-7xl font-light text-gray-800 tracking-tight">
              {formatTime(time)}
            </div>
            <div className="text-xl text-gray-500 font-medium">
              {formatDate(time)}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div className="text-7xl font-light text-gray-800 font-mono tracking-tight">
              {formatStopwatch(elapsed)}
            </div>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full text-white font-medium shadow-md transition-transform hover:scale-105 active:scale-95 ${
                  isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setElapsed(0);
                }}
                className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-medium shadow-sm transition-transform hover:scale-105 active:scale-95 hover:bg-gray-300"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockApp;
