import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from './ipc';
import { registerProtocolsPrivileged, registerProtocols } from './protocols';
import { createWindow } from './window';
import { initAutoUpdater } from './services/platform/update';
import { setAppMenu } from './menu';

registerProtocolsPrivileged();

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.github.super-kato.tag-util');

  registerProtocols();

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  registerIpcHandlers();

  initAutoUpdater();
  setAppMenu();
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
