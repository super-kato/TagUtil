import { selectDirectory } from '@services/platform/dialog';
import { getDirname, joinPaths } from '@services/platform/path';
import { getPlatform } from '@services/platform/platform';
import { IPC_CHANNELS } from '@shared/ipc';
import { type Platform } from '@shared/platform';
import { handleWithLogging } from './handler-utils';

/**
 * プラットフォーム汎用（OSダイアログ等）のIPCハンドラーを登録します。
 */
export const registerPlatformHandlers = (): void => {
  // フォルダ選択ダイアログを表示
  handleWithLogging(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    return await selectDirectory();
  });

  // プラットフォームを取得
  handleWithLogging(IPC_CHANNELS.GET_PLATFORM, async (): Promise<Platform> => {
    return getPlatform();
  });

  // ディレクトリ名を取得
  handleWithLogging(IPC_CHANNELS.PATH_DIRNAME, async (_event, p: string) => {
    return getDirname(p);
  });

  // パスを結合
  handleWithLogging(IPC_CHANNELS.PATH_JOIN, async (_event, ...paths: string[]) => {
    return joinPaths(...paths);
  });
};
