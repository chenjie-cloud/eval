import React from 'react';
import { useFileSystemStore } from '../store/fileSystemStore';
import { useWindowStore } from '../store/windowStore';
import { Folder, FileText, ArrowUp } from 'lucide-react';

export const Explorer: React.FC = () => {
  const { nodes, currentPathId, setCurrentPathId } = useFileSystemStore();
  const { openWindow } = useWindowStore();
  
  const currentFolder = nodes[currentPathId];
  const children = Object.values(nodes).filter((n) => n.parentId === currentPathId);

  const handleDoubleClick = (id: string, type: 'file' | 'directory') => {
    if (type === 'directory') {
      setCurrentPathId(id);
    } else {
      const fileNode = nodes[id];
      openWindow(`editor-${id}`, `Text Editor - ${fileNode.name}`, 'TextEditor', { width: 600, height: 400 }, { fileId: id });
    }
  };

  const handleGoUp = () => {
    if (currentFolder?.parentId) {
      setCurrentPathId(currentFolder.parentId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-mono">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b-4 border-black bg-gray-200">
        <button
          onClick={handleGoUp}
          disabled={!currentFolder?.parentId}
          className="p-1 brutalist-border bg-white hover:bg-gray-300 disabled:opacity-50 brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          title="Go Up"
        >
          <ArrowUp size={16} strokeWidth={3} />
        </button>
        <div className="flex-1 px-2 py-1 bg-white brutalist-border text-sm font-bold truncate">
          {currentFolder ? currentFolder.name : 'Unknown'}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {children.map((node) => (
            <div
              key={node.id}
              className="flex flex-col items-center gap-1 p-2 brutalist-border bg-white hover:bg-[#00ffff] cursor-pointer text-center group brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              onDoubleClick={() => handleDoubleClick(node.id, node.type)}
            >
              {node.type === 'directory' ? (
                <Folder size={32} className="text-black" strokeWidth={2} />
              ) : (
                <FileText size={32} className="text-black" strokeWidth={2} />
              )}
              <span className="text-xs font-bold truncate w-full" title={node.name}>
                {node.name}
              </span>
            </div>
          ))}
          {children.length === 0 && (
            <div className="col-span-full text-center text-black font-bold mt-8 border-2 border-dashed border-black p-4">
              THIS FOLDER IS EMPTY
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
