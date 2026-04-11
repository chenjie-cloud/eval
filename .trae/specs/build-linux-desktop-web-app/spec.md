# Build Linux Desktop Web App Spec

## Why
The user wants to build a Linux-style desktop environment entirely in the browser. This requires a robust window management system, mock applications, and a cohesive operating system aesthetic, serving as an advanced web development project.

## What Changes
- Initialize a React application using Vite and Tailwind CSS.
- Create a global state manager for windows, mock file system, and system settings.
- Implement a draggable, resizable window component.
- Build the Desktop interface with a wallpaper and desktop icons.
- Build the Taskbar with a Start Menu, active applications list, and system tray.
- Develop core mock applications: Terminal, File Explorer, Text Editor, and Settings.

## Impact
- Affected specs: New standalone frontend application.
- Affected code: Complete project setup in `/workspace`.

## ADDED Requirements
### Requirement: Desktop Workspace
The system SHALL provide a full-screen desktop area that can display a background image, host desktop shortcuts, and contain draggable application windows.

#### Scenario: Launching an App
- **WHEN** user double-clicks a desktop icon or selects an app from the Start Menu
- **THEN** a new window instance for that application is created and focused on the desktop.

### Requirement: Window Management
The system SHALL manage overlapping windows, allowing them to be dragged, resized, minimized to the taskbar, maximized to fill the desktop, and closed.

#### Scenario: Focusing a Window
- **WHEN** user clicks on a background window
- **THEN** the window's z-index is brought to the front and it receives focus state.

### Requirement: Taskbar and Start Menu
The system SHALL display a fixed panel at the bottom containing a Start button, indicators for open windows, and a system tray showing the current time.

### Requirement: Mock Applications
The system SHALL include basic functional mock applications.
- **Terminal**: Accepts text input and outputs simulated command responses.
- **File Explorer**: Navigates a mock directory tree.
- **Text Editor**: Opens and edits mock text files.
