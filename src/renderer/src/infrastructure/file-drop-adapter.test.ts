import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllPathsFromDropEvent, type DropEventLike } from './file-drop-adapter';

describe('getAllPathsFromDropEvent', () => {
  const mockGetPathForFile = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('window', { api: { getPathForFile: mockGetPathForFile } });
    mockGetPathForFile.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('ドロップされたファイルからパスを抽出すること', () => {
    const mockFiles = [{ name: 'test1.flac' }, { name: 'test2.flac' }] as File[];

    mockGetPathForFile.mockImplementation((file: File) => `/path/to/${file.name}`);

    const event: DropEventLike = { dataTransfer: { files: mockFiles } };

    const paths = getAllPathsFromDropEvent(event);

    expect(paths).toEqual(['/path/to/test1.flac', '/path/to/test2.flac']);
    expect(mockGetPathForFile).toHaveBeenCalledTimes(2);
  });

  it('dataTransfer がない場合は空配列を返すこと', () => {
    const event: DropEventLike = { dataTransfer: null };
    const paths = getAllPathsFromDropEvent(event);
    expect(paths).toEqual([]);
  });

  it('files が空の場合は空配列を返すこと', () => {
    const event: DropEventLike = { dataTransfer: { files: [] } };
    const paths = getAllPathsFromDropEvent(event);
    expect(paths).toEqual([]);
  });

  it('getPathForFile が null を返した場合はフィルタリングされること', () => {
    const mockFiles = [{ name: 'test1.flac' }, { name: 'test2.flac' }] as File[];

    mockGetPathForFile.mockReturnValueOnce('/path/to/test1.flac').mockReturnValueOnce(null);

    const event: DropEventLike = { dataTransfer: { files: mockFiles } };

    const paths = getAllPathsFromDropEvent(event);

    expect(paths).toEqual(['/path/to/test1.flac']);
  });
});
