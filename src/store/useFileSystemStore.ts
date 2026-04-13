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
        const node = get().nodes[path];
        if (!node || node.type !== 'file') return null;
        return node.content ?? null;
      },

      write: (path: string, content: string) => set((state) => {
        const name = path.split('/').pop() || '';
        const now = Date.now();
        const existingNode = state.nodes[path];

        return {
          nodes: {
            ...state.nodes,
            [path]: {
              path,
              name,
              type: 'file',
              content,
              createdAt: existingNode ? existingNode.createdAt : now,
              updatedAt: now,
            },
          },
        };
      }),

      delete: (path: string) => set((state) => {
        if (path === '/') return state; // Prevent deleting root

        const newNodes = { ...state.nodes };
        const nodeToDelete = newNodes[path];

        if (nodeToDelete?.type === 'directory') {
          // Delete directory and all its contents
          const prefix = path.endsWith('/') ? path : `${path}/`;
          Object.keys(newNodes).forEach((key) => {
            if (key.startsWith(prefix) || key === path) {
              delete newNodes[key];
            }
          });
        } else {
          // Delete single file
          delete newNodes[path];
        }

        return { nodes: newNodes };
      }),

      mkdir: (path: string) => set((state) => {
        const name = path.split('/').pop() || '';
        const now = Date.now();
        
        // Prevent overwriting existing nodes
        if (state.nodes[path]) return state;

        return {
          nodes: {
            ...state.nodes,
            [path]: {
              path,
              name,
              type: 'directory',
              createdAt: now,
              updatedAt: now,
            },
          },
        };
      }),

      list: (path: string) => {
        const { nodes } = get();
        // Normalize path
        const dirPrefix = path.endsWith('/') ? path : `${path}/`;
        
        return Object.values(nodes).filter((node) => {
          // Exclude the directory itself
          if (node.path === path) return false;
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
