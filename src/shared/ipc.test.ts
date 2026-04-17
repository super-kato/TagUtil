import { describe, it, expect } from 'vitest';
import { IMAGE_PROTOCOL_SCHEME, IPC_CHANNELS } from './ipc';

describe('ipc shared constants', () => {
  it('IMAGE_PROTOCOL_SCHEME が正しく定義されていること', () => {
    expect(IMAGE_PROTOCOL_SCHEME).toBe('flac-image');
  });

  it('IPC_CHANNELS が正しく定義されていること', () => {
    expect(IPC_CHANNELS.READ_METADATA).toBe('flac:read-metadata');
    expect(IPC_CHANNELS.WRITE_METADATA).toBe('flac:write-metadata');
    expect(IPC_CHANNELS.SELECT_DIRECTORY).toBe('flac:select-directory');
    expect(IPC_CHANNELS.SCAN_DIRECTORY).toBe('flac:scan-directory');
    expect(IPC_CHANNELS.PICK_IMAGE).toBe('flac:pick-image');
  });
});
