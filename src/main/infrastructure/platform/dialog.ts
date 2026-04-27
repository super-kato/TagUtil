import { SUPPORTED_IMAGE_EXTENSIONS } from '@domain/file-extensions';
import { dialog, OpenDialogOptions } from 'electron';

/**
 * フォルダ選択ダイアログを表示し、選択されたパスを返します。
 * @returns 選択されたディレクトリのパス。キャンセルされた場合は null。
 */
export const selectDirectory = async (): Promise<string | null> => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  return result.canceled ? null : result.filePaths[0];
};

/**
 * 画像ファイル選択ダイアログを表示し、選択されたパスを返します。
 * @param options ダイアログの追加オプション
 * @returns 選択された画像ファイルのパス。キャンセルされた場合は null。
 */
export const pickImageFile = async (
  options: Partial<OpenDialogOptions> = {}
): Promise<string | null> => {
  const result = await dialog.showOpenDialog({
    title: 'Select Artwork',
    filters: [
      {
        name: 'Images',
        extensions: SUPPORTED_IMAGE_EXTENSIONS.map((ext) => ext.replace(/^\./, ''))
      }
    ],
    properties: ['openFile'],
    ...options
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
};
