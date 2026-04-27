import { electronApp, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow } from 'electron';
import { logger } from './infrastructure/logging/logger';
import { initializeIpc } from './ipc';
import { setAppMenu } from './menu';
import { registerProtocols, registerProtocolsPrivileged } from './protocols';
import { initAutoUpdater } from './services/platform/update';
import { createWindow } from './window';

logger.info({ context: 'application', message: 'Application launching...' });

registerProtocolsPrivileged();

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.github.super-kato.tag-util');

  registerProtocols();

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  initializeIpc();

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

app.on('will-quit', () => {
  logger.info({ context: 'application', message: 'Application quitting...' });
});
