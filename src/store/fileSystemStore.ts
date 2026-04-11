import { create } from 'zustand';

export type FileType = 'file' | 'directory';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

interface FileSystemState {
  nodes: Record<string, FileNode>;
  currentPathId: string; // The ID of the current directory, null for root
  
  // Actions
  setCurrentPathId: (id: string) => void;
  createFile: (name: string, parentId: string, content?: string) => string | null;
  createDirectory: (name: string, parentId: string) => string | null;
  deleteNode: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  renameNode: (id: string, newName: string) => void;
  
  // Helpers (can be used in components by accessing state)
  // getChildren: (parentId: string) => FileNode[];
  // getPath: (id: string) => FileNode[];
}

const initialNodes: Record<string, FileNode> = {
  'root': {
    id: 'root',
    name: 'Root',
    type: 'directory',
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'desktop': {
    id: 'desktop',
    name: 'Desktop',
    type: 'directory',
    parentId: 'root',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'documents': {
    id: 'documents',
    name: 'Documents',
    type: 'directory',
    parentId: 'root',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'readme': {
    id: 'readme',
    name: 'README.md',
    type: 'file',
    parentId: 'desktop',
    content: '# Welcome to WebOS\n\nThis is a mock operating system built with React and Zustand.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  nodes: initialNodes,
  currentPathId: 'desktop', // Default to desktop

  setCurrentPathId: (id) => set({ currentPathId: id }),

  createFile: (name, parentId, content = '') => {
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if file with same name exists in parent
    const exists = Object.values(get().nodes).some(
      (node) => node.parentId === parentId && node.name === name && node.type === 'file'
    );
    
    if (exists) return null;

    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          id,
          name,
          type: 'file',
          parentId,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
    }));
    
    return id;
  },

  createDirectory: (name, parentId) => {
    const id = `dir_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if directory with same name exists in parent
    const exists = Object.values(get().nodes).some(
      (node) => node.parentId === parentId && node.name === name && node.type === 'directory'
    );
    
    if (exists) return null;

    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: {
          id,
          name,
          type: 'directory',
          parentId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
    }));
    
    return id;
  },

  deleteNode: (id) => {
    // Don't allow deleting root or desktop/documents for safety
    if (['root', 'desktop', 'documents'].includes(id)) return;
    
    set((state) => {
      const newNodes = { ...state.nodes };
      
      // Function to recursively delete children
      const deleteRecursively = (nodeId: string) => {
        const children = Object.values(newNodes).filter(n => n.parentId === nodeId);
        children.forEach(child => deleteRecursively(child.id));
        delete newNodes[nodeId];
      };
      
      deleteRecursively(id);
      
      // If we deleted the current path, move up to root
      const currentPathId = state.currentPathId === id ? 'root' : state.currentPathId;
      
      return { nodes: newNodes, currentPathId };
    });
  },

  updateFileContent: (id, content) =>
    set((state) => {
      const node = state.nodes[id];
      if (!node || node.type !== 'file') return state;
      
      return {
        nodes: {
          ...state.nodes,
          [id]: {
            ...node,
            content,
            updatedAt: Date.now(),
          },
        },
      };
    }),

  renameNode: (id, newName) =>
    set((state) => {
      const node = state.nodes[id];
      if (!node) return state;
      
      // Don't allow renaming system folders
      if (['root', 'desktop', 'documents'].includes(id)) return state;
      
      // Check if name already exists in parent
      const exists = Object.values(state.nodes).some(
        (n) => n.parentId === node.parentId && n.name === newName && n.id !== id
      );
      
      if (exists) return state;

      return {
        nodes: {
          ...state.nodes,
          [id]: {
            ...node,
            name: newName,
            updatedAt: Date.now(),
          },
        },
      };
    }),
}));
