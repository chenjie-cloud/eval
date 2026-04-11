# Tasks
- [x] Task 1: Initialize Project: Create a React + Vite + Tailwind CSS project in the workspace.
  - [x] SubTask 1.1: Run `npm create vite@latest . -- --template react-ts`
  - [x] SubTask 1.2: Install Tailwind CSS and its dependencies
  - [x] SubTask 1.3: Install `framer-motion`, `zustand`, `lucide-react`, and `react-rnd`
- [x] Task 2: Setup Global State: Implement state management for the desktop environment.
  - [x] SubTask 2.1: Create window management store (open, close, focus, minimize, maximize)
  - [x] SubTask 2.2: Create mock file system store (directories, files, content)
- [x] Task 3: Build Core UI Layout: Create the Desktop and Taskbar components.
  - [x] SubTask 3.1: Implement full-screen Desktop component with background image
  - [x] SubTask 3.2: Implement Taskbar with Start Menu button, system tray (clock), and open window indicators
- [x] Task 4: Build Window Manager: Implement draggable and resizable windows.
  - [x] SubTask 4.1: Create Window component wrapping `react-rnd`
  - [x] SubTask 4.2: Add title bar with minimize, maximize, and close controls
  - [x] SubTask 4.3: Implement z-index and focus management
- [x] Task 5: Implement Mock Applications: Build the core apps.
  - [x] SubTask 5.1: Build Terminal app (input handling, basic command parsing like `echo`, `ls`, `clear`)
  - [x] SubTask 5.2: Build File Explorer app (navigate mock directories, open files)
  - [x] SubTask 5.3: Build Text Editor app (edit text content and save to mock file system)
  - [x] SubTask 5.4: Build Settings app (change wallpaper or theme)
- [x] Task 6: Polish UI/UX: Refine aesthetics to match a classic Linux desktop.
  - [x] SubTask 6.1: Add icons to Start Menu and Desktop
  - [x] SubTask 6.2: Add smooth animations using Framer Motion
  - [x] SubTask 6.3: Ensure responsiveness (maximize windows on small screens)

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]

- [x] Task 7: Fix Missing Functionality: Connect Explorer and Text Editor.
  - [x] SubTask 7.1: Allow opening files from File Explorer directly into Text Editor.
  - [x] SubTask 7.2: Add capability to create new files in Text Editor and save them to the mock file system.
