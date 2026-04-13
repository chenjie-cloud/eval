import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.wikipedia.org/');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org/');
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org/']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUrl(history[currentIndex - 1]);
      setInputUrl(history[currentIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUrl(history[currentIndex + 1]);
      setInputUrl(history[currentIndex + 1]);
    }
  };

  const handleReload = () => {
    // Hack to reload iframe
    const currentUrl = url;
    setUrl('');
    setTimeout(() => setUrl(currentUrl), 50);
  };

  const handleHome = () => {
    setInputUrl('https://www.wikipedia.org/');
    handleNavigate();
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border-b border-gray-300">
        <button 
          onClick={handleBack} 
          disabled={currentIndex === 0}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <button 
          onClick={handleForward}
          disabled={currentIndex === history.length - 1}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-gray-700" />
        </button>
        <button 
          onClick={handleReload}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <RotateCw className="w-4 h-4 text-gray-700" />
        </button>
        <button 
          onClick={handleHome}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <Home className="w-4 h-4 text-gray-700" />
        </button>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white rounded-full border border-gray-300 px-3 py-1 ml-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
            placeholder="Search or enter web address"
          />
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 relative">
        {url ? (
          <iframe
            src={url}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser Content"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <RotateCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
