import React, { useState, useEffect } from 'react';
import { useFileSystemStore } from '../store/fileSystemStore';

interface TextEditorProps {
  fileId?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({ fileId }) => {
  const { nodes, updateFileContent, createFile, currentPathId } = useFileSystemStore();
  
  const files = Object.values(nodes).filter((n) => n.type === 'file');
  const [selectedFileId, setSelectedFileId] = useState<string>(fileId || (files.length > 0 ? files[0].id : ''));
  const [content, setContent] = useState(
    fileId ? (nodes[fileId]?.content || '') : (files.length > 0 ? (files[0].content || '') : '')
  );

  useEffect(() => {
    if (fileId && nodes[fileId]) {
      setSelectedFileId(fileId);
      setContent(nodes[fileId].content || '');
    }
  }, [fileId]); // only trigger when fileId from props changes, otherwise typing would reset content if nodes changes

  const handleSelectFile = (id: string) => {
    setSelectedFileId(id);
    setContent(nodes[id]?.content || '');
  };

  const handleSave = () => {
    if (selectedFileId) {
      updateFileContent(selectedFileId, content);
    }
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter new file name:');
    if (fileName) {
      const newFileId = createFile(fileName, currentPathId, '');
      if (newFileId) {
        setSelectedFileId(newFileId);
        setContent('');
      } else {
        alert('File already exists or could not be created.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-black font-mono">
      <div className="flex items-center gap-2 p-2 border-b-4 border-black bg-gray-200">
        <select
          value={selectedFileId}
          onChange={(e) => handleSelectFile(e.target.value)}
          className="flex-1 p-1 brutalist-border bg-white outline-none focus:bg-[#ffff00] transition-colors"
        >
          <option value="" disabled>SELECT A FILE...</option>
          {files.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <button
          onClick={handleNewFile}
          className="px-3 py-1 brutalist-border bg-[#00ffff] hover:bg-[#00cccc] font-bold uppercase brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          New File
        </button>
        <button
          onClick={handleSave}
          disabled={!selectedFileId}
          className="px-3 py-1 brutalist-border bg-[#ffff00] hover:bg-[#cccc00] disabled:opacity-50 font-bold uppercase brutalist-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Save
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!selectedFileId}
        className="flex-1 p-4 w-full h-full resize-none outline-none font-mono text-sm bg-white text-black placeholder-gray-500 disabled:bg-gray-100"
        placeholder={selectedFileId ? "Type your text here..." : "Please select a file to edit"}
      />
    </div>
  );
};
