import { protocol } from 'electron';
import { IMAGE_PROTOCOL_SCHEME } from '@shared/ipc';
import { handleImageRequest } from './image-protocol';

/**
 * アプリの起動(ready)前に必要な特権スキームの登録を行います。
 */
export const registerProtocolsPrivileged = (): void => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: IMAGE_PROTOCOL_SCHEME,
      privileges: { standard: true, secure: true, supportFetchAPI: true }
    }
  ]);
};

/**
 * すべてのカスタムプロトコルハンドラーを登録します。
 */
export const registerProtocols = (): void => {
  protocol.handle(IMAGE_PROTOCOL_SCHEME, handleImageRequest);
};
