import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export const normalizePath = (path: string): string => {
  const isAbsolute = path.startsWith('/');
  const parts = path.split('/');
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }
  
  const resolved = stack.join('/');
  return isAbsolute ? '/' + resolved : resolved;
};

// Helper to create directories recursively
const createDirectories = (nodes: Record<string, FileNode>, path: string, now: number) => {
  const parts = path.split('/').filter(Boolean);
  let currentPath = '';
  let changed = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath = currentPath === '/' || currentPath === '' ? '/' + part : currentPath + '/' + part;

    if (!nodes[currentPath]) {
      nodes[currentPath] = {
        path: currentPath,
        name: part,
        type: 'directory',
        createdAt: now,
        updatedAt: now,
      };
      changed = true;
    } else if (nodes[currentPath].type !== 'directory') {
      throw new Error(`mkdir: cannot create directory '${path}': Not a directory`);
    }
  }
  return changed;
};

interface FileSystemStore {
  nodes: Record<string, FileNode>;
  read: (path: string) => string | null;
  write: (path: string, content: string) => void;
  delete: (path: string) => void;
  mkdir: (path: string) => void;
  list: (path: string) => FileNode[];
}

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      nodes: {
        '/': {
          path: '/',
          name: 'root',
          type: 'directory',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },

      read: (path: string) => {
        const normPath = normalizePath(path);
        const node = get().nodes[normPath];
        if (!node || node.type !== 'file') return null;
        return node.content ?? null;
      },

      write: (path: string, content: string) => set((state) => {
        const normPath = normalizePath(path);
        if (normPath === '/') throw new Error('Cannot write to root');
        
        const name = normPath.split('/').pop() || '';
        const parentPath = normPath.substring(0, normPath.lastIndexOf('/')) || '/';
        const now = Date.now();
        const newNodes = { ...state.nodes };

        // Ensure parent directories exist
        if (parentPath !== '/') {
          createDirectories(newNodes, parentPath, now);
        }

        const existingNode = newNodes[normPath];

        newNodes[normPath] = {
          path: normPath,
          name,
          type: 'file',
          content,
          createdAt: existingNode ? existingNode.createdAt : now,
          updatedAt: now,
        };

        return { nodes: newNodes };
      }),

      delete: (path: string) => set((state) => {
        const normPath = normalizePath(path);
        if (normPath === '/') return state; // Prevent deleting root

        const newNodes = { ...state.nodes };
        const nodeToDelete = newNodes[normPath];

        if (nodeToDelete?.type === 'directory') {
          // Delete directory and all its contents
          const prefix = normPath.endsWith('/') ? normPath : `${normPath}/`;
          Object.keys(newNodes).forEach((key) => {
            if (key.startsWith(prefix) || key === normPath) {
              delete newNodes[key];
            }
          });
        } else {
          // Delete single file
          delete newNodes[normPath];
        }

        return { nodes: newNodes };
      }),

      mkdir: (path: string) => set((state) => {
        const normPath = normalizePath(path);
        if (state.nodes[normPath] && state.nodes[normPath].type === 'directory') {
          return state;
        }

        const newNodes = { ...state.nodes };
        const now = Date.now();
        
        const changed = createDirectories(newNodes, normPath, now);

        return changed ? { nodes: newNodes } : state;
      }),

      list: (path: string) => {
        const normPath = normalizePath(path);
        const { nodes } = get();
        // Normalize path
        const dirPrefix = normPath.endsWith('/') ? normPath : `${normPath}/`;
        
        return Object.values(nodes).filter((node) => {
          // Exclude the directory itself
          if (node.path === normPath) return false;
          // Must start with directory path
          if (!node.path.startsWith(dirPrefix)) return false;
          // Check if it's an immediate child (no further slashes in the relative path)
          const relativePath = node.path.substring(dirPrefix.length);
          return !relativePath.includes('/');
        });
      },
    }),
    {
      name: 'fs-storage', // unique name in localStorage
    }
  )
);
