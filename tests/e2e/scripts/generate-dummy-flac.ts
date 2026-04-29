import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * 最小限の有効なFLACファイル（無音オーディオデータを含む）を生成するスクリプト。
 * 外部依存なしでCI環境でも動作します。
 */
function generateDummyFlac(outputPath: string): void {
  // 有効なFLAC構造を持つBase64 (STREAMINFO + 最小フレーム)
  const base64Data =
    'fLaCbmSBT00AAABhYmNkZWYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCpYID' +
    'AAAAAABByoIDAAABAA78v+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/' +
    '6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/6//r/+v/';

  const buffer = Buffer.from(base64Data, 'base64');
  writeFileSync(outputPath, buffer);
  console.log(`Generated dummy FLAC: ${outputPath}`);
}

const targetDir = 'tests/e2e/fixtures';
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

['test1.flac', 'test2.flac'].forEach((file) => {
  generateDummyFlac(join(targetDir, file));
});
