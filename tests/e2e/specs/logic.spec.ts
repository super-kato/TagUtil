import { e2eTest as test, expect } from '../fixtures';
import { join } from 'path';

test.describe('業務ロジックテスト', () => {
  test('ディレクトリを読み込み、メタデータを編集して保存し、リネームできること', async ({
    mainPage,
    electronApp
  }) => {
    const fixturesDir = join(process.cwd(), 'tests/e2e/fixtures');

    await electronApp.evaluate(async (electronModule, dir) => {
      const { ipcMain, BrowserWindow } = electronModule;
      
      const sendLog = (context: string, message = ''): void => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          win.webContents.send('app:on-log', {
            level: 'info',
            context,
            message,
            timestamp: new Date().toISOString()
          });
        }
      };

      ipcMain.removeHandler('app:select-dir');
      ipcMain.handle('app:select-dir', async (): Promise<string> => dir);
      
      ipcMain.removeHandler('tag:scan-dir');
      ipcMain.handle('tag:scan-dir', async (): Promise<any> => {
        return { 
          type: 'success', 
          value: { paths: [join(dir, 'test1.flac'), join(dir, 'test2.flac')], isLimited: false } 
        };
      });

      ipcMain.removeHandler('tag:read-tag');
      ipcMain.handle('tag:read-tag', async (_event, path: string): Promise<any> => {
        return { 
          type: 'success', 
          value: { path, metadata: { title: 'Initial Title', artist: 'Initial Artist', album: '', track: '', year: '', genre: '', comment: '', picture: undefined } } 
        };
      });

      ipcMain.removeHandler('tag:write-tag');
      ipcMain.handle('tag:write-tag', async (_event, track: any): Promise<any> => {
        sendLog('tag:write-tag', `Saved ${track.path}`);
        return { type: 'success', value: track.path };
      });

      ipcMain.removeHandler('tag:gen-path');
      ipcMain.handle('tag:gen-path', async (_event, _track: any): Promise<string> => {
        return `${_track.path}.renamed.flac`;
      });

      ipcMain.removeHandler('tag:rename');
      ipcMain.handle('tag:rename', async (): Promise<any> => {
        sendLog('tag:rename', 'Renamed files');
        return { type: 'success', value: undefined };
      });
    }, fixturesDir);

    await mainPage.toolbar.openDirectoryButton.click();
    await expect(mainPage.trackGrid.rows).toHaveCount(2, { timeout: 15000 });

    await mainPage.trackGrid.selectTrack(0);

    await mainPage.inspector.setTitle('E2E Title');
    await mainPage.inspector.root.locator('input#title').dispatchEvent('change');
    
    await expect(mainPage.toolbar.saveChangesButton).toBeEnabled();
    await mainPage.toolbar.saveChangesButton.click();
    
    await mainPage.statusBar.toggleLogs();
    
    await expect(async () => {
      const logs = await mainPage.statusBar.getLogs();
      if (!logs.some(l => l.includes('tag:write-tag'))) throw new Error('Wait');
    }).toPass({ timeout: 10000 });

    await expect(mainPage.toolbar.renameFilesButton).toBeEnabled();
    await mainPage.toolbar.renameFilesButton.click();

    const confirmBtn = mainPage.page.locator('button.confirm');
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    await mainPage.screenshot('06_最終確認');
  });
});
