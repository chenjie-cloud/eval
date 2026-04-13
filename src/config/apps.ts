import {
  Calculator as CalculatorIcon,
  Globe,
  Files,
  Gamepad2,
  Image as ImageIcon,
  Music,
  Settings as SettingsIcon,
  Terminal as TerminalIcon,
  Clock,
  Palette,
  Activity,
  FileText
} from 'lucide-react';
import type { AppConfig } from '../store/desktopStore';

import BrowserApp from '../apps/Browser';
import CalculatorApp from '../apps/Calculator';
import ClockApp from '../apps/ClockApp';
import FileExplorerApp from '../apps/FileExplorer';
import ImageViewerApp from '../apps/ImageViewer';
import MediaPlayerApp from '../apps/MediaPlayer';
import PaintApp from '../apps/Paint';
import SettingsApp from '../apps/Settings';
import SnakeGameApp from '../apps/SnakeGame';
import SystemMonitorApp from '../apps/SystemMonitor';
import TerminalApp from '../apps/Terminal';
import TextEditorApp from '../apps/TextEditor';

export const AVAILABLE_APPS: AppConfig[] = [
  { id: 'browser', name: 'Browser', icon: Globe, component: BrowserApp },
  { id: 'calculator', name: 'Calculator', icon: CalculatorIcon, component: CalculatorApp },
  { id: 'clock', name: 'Clock', icon: Clock, component: ClockApp },
  { id: 'files', name: 'Files', icon: Files, component: FileExplorerApp },
  { id: 'photos', name: 'Photos', icon: ImageIcon, component: ImageViewerApp },
  { id: 'media', name: 'Media Player', icon: Music, component: MediaPlayerApp },
  { id: 'paint', name: 'Paint', icon: Palette, component: PaintApp },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, component: SettingsApp },
  { id: 'games', name: 'Snake', icon: Gamepad2, component: SnakeGameApp },
  { id: 'monitor', name: 'System Monitor', icon: Activity, component: SystemMonitorApp },
  { id: 'terminal', name: 'Terminal', icon: TerminalIcon, component: TerminalApp },
  { id: 'editor', name: 'Text Editor', icon: FileText, component: TextEditorApp }
];
