import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanDirectory } from './scanner';
import * as fileScannerRepo from '@main/infrastructure/repositories/file/file-scanner-repository';
import { ScanResult } from '@shared/flac';

vi.mock('@main/infrastructure/repositories/file/file-scanner-repository');
vi.mock('@main/infrastructure/logging/logger');

describe('scanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scanDirectory', () => {
    it('FLACファイルが見つかった場合、成功を返すこと', async () => {
      const mockScanResult: ScanResult = {
        paths: ['/path/to/file1.flac', '/path/to/file2.flac'],
        isLimited: false
      };
      vi.mocked(fileScannerRepo.scanFiles).mockImplementation(async (_, filter) => {
        filter?.('test.flac');
        return mockScanResult;
      });

      const result = await scanDirectory(['/some/dir']);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value).toEqual(mockScanResult);
      }
      expect(fileScannerRepo.scanFiles).toHaveBeenCalled();
    });

    it('スキャン中にエラーが発生した場合、失敗を返すこと', async () => {
      const error = new Error('Scan error');
      vi.mocked(fileScannerRepo.scanFiles).mockRejectedValue(error);

      const result = await scanDirectory(['/some/dir']);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('SCAN_FAILED');
      }
    });

    it('空のパス配列を渡しても動作すること', async () => {
      const mockScanResult: ScanResult = {
        paths: [],
        isLimited: false
      };
      vi.mocked(fileScannerRepo.scanFiles).mockResolvedValue(mockScanResult);

      const result = await scanDirectory([]);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        expect(result.value.paths).toHaveLength(0);
      }
    });

    it('空のパス配列を渡してエラーが発生した場合でも動作すること', async () => {
      vi.mocked(fileScannerRepo.scanFiles).mockRejectedValue(new Error('Empty scan error'));

      const result = await scanDirectory([]);

      expect(result.type).toBe('error');
      if (result.type === 'error') {
        expect(result.error.type).toBe('SCAN_FAILED');
      }
    });
  });
});
