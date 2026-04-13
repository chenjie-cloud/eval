import React, { useState } from 'react';
import { useFileSystemStore } from '../store/useFileSystemStore';
import { Folder, File, ArrowLeft, Trash2, Plus } from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [newItemName, setNewItemName] = useState('');
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const fs = useFileSystemStore();

  const handleNavigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length ? `/${parts.join('/')}` : '/');
  };

  const handleNavigateDown = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    setCurrentPath(newPath);
  };

  const handleDelete = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    fs.delete(path);
  };

  const handleCreate = () => {
    if (!newItemName.trim()) {
      setIsCreating(null);
      return;
    }
    const path = currentPath === '/' ? `/${newItemName}` : `${currentPath}/${newItemName}`;
    if (isCreating === 'file') {
      fs.write(path, '');
    } else {
      fs.mkdir(path);
    }
    setNewItemName('');
    setIsCreating(null);
  };

  const nodes = fs.list(currentPath);

  return (
    <div className="flex flex-col h-full bg-white text-gray-800">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b bg-gray-100 gap-2">
        <button
          onClick={handleNavigateUp}
          disabled={currentPath === '/'}
          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
          title="Go Up"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 px-2 py-1 bg-white border rounded text-sm truncate">
          {currentPath}
        </div>
        <button
          onClick={() => setIsCreating('file')}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 text-sm"
          title="New File"
        >
          <File size={16} /> <Plus size={12} />
        </button>
        <button
          onClick={() => setIsCreating('folder')}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 text-sm"
          title="New Folder"
        >
          <Folder size={16} /> <Plus size={12} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {isCreating && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded border border-blue-200">
            {isCreating === 'file' ? <File size={20} className="text-blue-500" /> : <Folder size={20} className="text-blue-500" />}
            <input
              type="text"
              autoFocus
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(null);
              }}
              onBlur={handleCreate}
              className="flex-1 bg-transparent border-b border-blue-300 outline-none px-1 text-sm"
              placeholder={`New ${isCreating} name...`}
            />
          </div>
        )}

        {nodes.length === 0 && !isCreating ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            This folder is empty
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {nodes.map((node) => (
              <div
                key={node.path}
                className="group relative flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer text-center"
                onDoubleClick={() => {
                  if (node.type === 'directory') {
                    handleNavigateDown(node.name);
                  }
                }}
              >
                {node.type === 'directory' ? (
                  <Folder size={40} className="text-blue-500 mb-1" />
                ) : (
                  <File size={40} className="text-gray-500 mb-1" />
                )}
                <span className="text-xs break-words w-full truncate px-1" title={node.name}>
                  {node.name}
                </span>
                <button
                  onClick={(e) => handleDelete(e, node.path)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
