import React, { useState, useRef, useEffect } from 'react';
import { useFileSystemStore } from '../store/fileSystemStore';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { nodes, currentPathId } = useFileSystemStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';

    switch (command) {
      case 'echo':
        output = args.join(' ');
        break;
      case 'ls': {
        const children = Object.values(nodes).filter((n) => n.parentId === currentPathId);
        output = children.map((c) => c.name).join('  ') || 'Empty directory';
        break;
      }
      case 'clear':
        setHistory([]);
        return;
      default:
        output = `Command not found: ${command}`;
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="bg-black text-[#00ff00] font-mono p-4 h-full overflow-auto flex flex-col text-sm font-bold tracking-tight">
      <div className="flex-1">
        {history.map((h, i) => (
          <div key={i} className="mb-2">
            <div className="flex gap-2">
              <span className="text-[#00ffff] shrink-0">user@webos:~$</span>
              <span>{h.command}</span>
            </div>
            {h.output && <div className="whitespace-pre-wrap">{h.output}</div>}
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <span className="text-[#00ffff] shrink-0">user@webos:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-[#00ff00]"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
