import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from './ipc';
import { registerProtocolsPrivileged, registerProtocols } from './protocols';
import { createWindow } from './window';
import { initAutoUpdater } from './services/platform/update';
import { setAppMenu } from './menu';

// Register schemes as privileged to allow loading local resources
registerProtocolsPrivileged();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.github.super-kato.tag-util');

  // Register Custom Protocols
  registerProtocols();

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Register IPC handlers
  registerIpcHandlers();

  // Initialize auto-updater
  initAutoUpdater();

  // Set custom menu
  setAppMenu();

  // Create main window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
