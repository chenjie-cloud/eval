## 1. Architecture Design
```mermaid
graph TD
    A["Frontend (React + Vite)"] --> B["Window Manager (Zustand State)"]
    A --> C["Virtual File System (Zustand State)"]
    B --> D["Desktop Environment"]
    D --> E["Taskbar / Dock"]
    D --> F["Application Windows"]
    F --> G["Terminal"]
    F --> H["File Explorer"]
    F --> I["Settings"]
    F --> J["System Monitor"]
    F --> K["Calculator"]
    F --> L["Text Editor"]
    F --> M["Browser"]
    F --> N["Calendar"]
    F --> O["Weather"]
    F --> P["Clock"]
    F --> Q["Snake Game"]
    F --> R["Image Viewer"]
```

## 2. Technology Description
- Frontend: React@18 + tailwindcss@3 + vite + zustand (for global state) + framer-motion (for smooth window transitions, minimizing animations) + react-rnd (for resizable/draggable windows).
- Initialization Tool: vite
- Icons: lucide-react
- State Management: Zustand (Window state, Z-index management, Virtual File System, System Settings).
- Styling: Tailwind CSS, Custom CSS for specific desktop aesthetics (glassmorphism, gradient meshes).

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | Desktop Environment Home |

## 4. API Definitions (if backend exists)
No backend. All state is held in memory and persisted in `localStorage` for the virtual file system and user settings.

## 5. Server Architecture Diagram (if backend exists)
Not applicable (Client-side only).

## 6. Data Model (if applicable)
### 6.1 Data Model Definition
```mermaid
erDiagram
    WINDOW {
        string id
        string title
        string icon
        boolean isMinimized
        boolean isMaximized
        int zIndex
        int x
        int y
        int width
        int height
    }
    FILE_NODE {
        string id
        string name
        string type
        string content
        string parentId
    }
    SETTINGS {
        string wallpaper
        string theme
        string accentColor
    }
```

### 6.2 Data Definition Language
Data is managed via Zustand stores and serialized to localStorage.
- `useWindowStore`: Manages the state of currently open windows, stacking order, and positions.
- `useFileSystemStore`: Manages tree of `FILE_NODE` objects.
- `useSettingsStore`: Manages wallpaper, theme, and user preferences.