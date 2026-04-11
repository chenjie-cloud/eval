import React from 'react';
import { TerminalSquare, Folder, FileText, Settings as SettingsIcon } from 'lucide-react';

export interface AppConfig {
  id: string;
  title: string;
  component: string;
  icon: React.ReactNode;
  color: string;
}

export const APPS: AppConfig[] = [
  { id: 'term-1', title: 'Terminal', component: 'Terminal', icon: <TerminalSquare size={32} />, color: 'bg-[#ff00ff]' },
  { id: 'exp-1', title: 'Explorer', component: 'Explorer', icon: <Folder size={32} />, color: 'bg-[#00ffff]' },
  { id: 'txt-1', title: 'Text Editor', component: 'TextEditor', icon: <FileText size={32} />, color: 'bg-[#ffff00]' },
  { id: 'set-1', title: 'Settings', component: 'Settings', icon: <SettingsIcon size={32} />, color: 'bg-[#00ff00]' },
];
