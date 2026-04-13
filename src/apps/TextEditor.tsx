import { useState } from 'react';
import { useFileSystemStore } from '../store/useFileSystemStore';
import { Save, FileText, Plus } from 'lucide-react';

export const TextEditor = () => {
  const fs = useFileSystemStore();
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Get all files from the store (flattened)
  const allFiles = Object.values(fs.nodes).filter(n => n.type === 'file');

  const handleSelectFile = (path: string) => {
    if (isDirty) {
      const confirm = window.confirm('You have unsaved changes. Discard them?');
      if (!confirm) return;
    }
    const fileContent = fs.read(path);
    setActiveFile(path);
    setContent(fileContent || '');
    setIsDirty(false);
  };

  const handleSave = () => {
    if (activeFile) {
      fs.write(activeFile, content);
      setIsDirty(false);
    }
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      setIsCreating(false);
      return;
    }
    let name = newFileName.trim();
    if (!name.includes('.')) {
      name += '.txt'; // Default extension
    }
    const path = `/${name}`;
    fs.write(path, '');
    setNewFileName('');
    setIsCreating(false);
    handleSelectFile(path);
  };

  return (
    <div className="flex h-full bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <span className="font-semibold text-sm text-gray-600">Files</span>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-gray-200 rounded text-gray-600"
            title="New File"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          {isCreating && (
            <div className="mb-2">
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFile();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                onBlur={handleCreateFile}
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded outline-none"
                placeholder="filename.txt"
              />
            </div>
          )}
          {allFiles.length === 0 && !isCreating ? (
            <div className="text-xs text-gray-400 text-center mt-4">No files found</div>
          ) : (
            <ul className="space-y-1">
              {allFiles.map(f => (
                <li key={f.path}>
                  <button
                    onClick={() => handleSelectFile(f.path)}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center gap-2 truncate ${
                      activeFile === f.path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FileText size={14} className="shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeFile ? (
          <>
            <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {activeFile} {isDirty && '*'}
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                  isDirty 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={14} /> Save
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsDirty(true);
              }}
              className="flex-1 w-full p-4 resize-none outline-none font-mono text-sm text-gray-800 bg-white"
              spellCheck={false}
              placeholder="Type your text here..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-2 opacity-50" />
              <p>Select a file from the sidebar to edit</p>
              <p className="text-sm mt-1">Or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
