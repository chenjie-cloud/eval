import React, { useState, useRef, useEffect } from 'react';
import { useFileSystemStore, normalizePath } from '../store/useFileSystemStore';

export const Terminal = () => {
  const [history, setHistory] = useState<{ command: string; output: string | React.ReactNode }[]>([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fs = useFileSystemStore();

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parseCommand = (commandStr: string): string[] => {
      const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
      const result: string[] = [];
      let match;
      while ((match = regex.exec(commandStr)) !== null) {
        result.push(match[1] ?? match[2] ?? match[0]);
      }
      return result;
    };

    const parts = parseCommand(trimmed);
    const command = parts[0];
    const args = parts.slice(1);

    let output: string | React.ReactNode = '';

    const resolvePath = (p: string) => {
      let absolutePath = p;
      if (!p.startsWith('/')) {
        absolutePath = cwd === '/' ? `/${p}` : `${cwd}/${p}`;
      }
      return normalizePath(absolutePath);
    };

    try {
      switch (command) {
        case 'help':
          output = 'Available commands: help, clear, pwd, ls, cd, mkdir, touch, cat, rm, echo';
          break;
        case 'clear':
          setHistory([]);
          return;
        case 'pwd':
          output = cwd;
          break;
        case 'ls': {
          const targetPath = args[0] ? resolvePath(args[0]) : cwd;
          const nodes = fs.list(targetPath);
          output = nodes.map(n => n.name).join(' ');
          break;
        }
        case 'cd': {
          const target = args[0];
          if (!target || target === '~') {
            setCwd('/');
          } else {
            const targetPath = resolvePath(target);
            const node = fs.nodes[targetPath];
            if (targetPath === '/') {
              setCwd('/');
            } else if (!node) {
              output = `cd: ${target}: No such file or directory`;
            } else if (node.type !== 'directory') {
              output = `cd: ${target}: Not a directory`;
            } else {
              setCwd(targetPath);
            }
          }
          break;
        }
        case 'mkdir': {
          if (!args[0]) {
            output = 'mkdir: missing operand';
          } else {
            const targetPath = resolvePath(args[0]);
            if (fs.nodes[targetPath]) {
              output = `mkdir: cannot create directory '${args[0]}': File exists`;
            } else {
              fs.mkdir(targetPath);
            }
          }
          break;
        }
        case 'touch': {
          if (!args[0]) {
            output = 'touch: missing file operand';
          } else {
            const targetPath = resolvePath(args[0]);
            if (!fs.nodes[targetPath]) {
              fs.write(targetPath, '');
            }
          }
          break;
        }
        case 'cat': {
          if (!args[0]) {
            output = 'cat: missing file operand';
          } else {
            const targetPath = resolvePath(args[0]);
            const node = fs.nodes[targetPath];
            if (!node) {
              output = `cat: ${args[0]}: No such file or directory`;
            } else if (node.type === 'directory') {
              output = `cat: ${args[0]}: Is a directory`;
            } else {
              output = fs.read(targetPath) || '';
            }
          }
          break;
        }
        case 'rm': {
          if (!args[0]) {
            output = 'rm: missing operand';
          } else {
            const targetPath = resolvePath(args[0]);
            if (!fs.nodes[targetPath]) {
              output = `rm: cannot remove '${args[0]}': No such file or directory`;
            } else {
              fs.delete(targetPath);
            }
          }
          break;
        }
        case 'echo': {
          let text = args.join(' ');
          const redirIndex = args.indexOf('>');
          if (redirIndex !== -1) {
            text = args.slice(0, redirIndex).join(' ');
            const file = args[redirIndex + 1];
            if (file) {
              const targetPath = resolvePath(file);
              fs.write(targetPath, text);
              output = '';
            } else {
              output = 'bash: syntax error near unexpected token `newline`';
            }
          } else {
            output = text;
          }
          break;
        }
        default:
          output = `command not found: ${command}`;
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        output = e.message;
      } else {
        output = String(e);
      }
    }

    setHistory(prev => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div 
      className="flex flex-col h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto" 
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((h, i) => (
        <div key={i} className="mb-2">
          <div className="flex">
            <span className="text-blue-400 mr-2">guest@system:{cwd}$</span>
            <span>{h.command}</span>
          </div>
          {h.output && <div className="whitespace-pre-wrap mt-1 text-gray-300">{h.output}</div>}
        </div>
      ))}
      <div className="flex">
        <span className="text-blue-400 mr-2">guest@system:{cwd}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-green-400"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;
