import { describe, it, expect } from 'vitest';
import { IMAGE_PROTOCOL_SCHEME, IPC_CHANNELS } from './ipc';

describe('ipc shared constants', () => {
  it('IMAGE_PROTOCOL_SCHEME が正しく定義されていること', () => {
    expect(IMAGE_PROTOCOL_SCHEME).toBe('flac-image');
  });

  it('IPC_CHANNELS が正しく定義されていること', () => {
    expect(IPC_CHANNELS.READ_TAG).toBe('tag:read-tag');
    expect(IPC_CHANNELS.WRITE_TAG).toBe('tag:write-tag');
    expect(IPC_CHANNELS.SELECT_DIR).toBe('app:select-dir');
    expect(IPC_CHANNELS.SCAN_DIR).toBe('tag:scan-dir');
    expect(IPC_CHANNELS.PICK_IMG).toBe('tag:pick-img');
  });
});
