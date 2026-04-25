import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * pnpm licenses list --json の出力形式を定義
 */
interface PnpmLicensePackage {
  name: string;
  versions: string[];
  license: string;
  path?: string;
}

type PnpmLicenseOutput = Record<string, PnpmLicensePackage[]>;

/**
 * ライセンス情報をパースし、ソートされたクレジット配列を生成します。
 */
const parseLicenses = (json: string): string[] => {
  const rawData = JSON.parse(json) as PnpmLicenseOutput;
  const credits: string[] = [];

  // ライセンス名ごとのグループをフラットな配列に変換
  for (const license in rawData) {
    for (const pkg of rawData[license]) {
      const entry = `${pkg.name} (${pkg.versions.join(', ')}) - ${pkg.license}`;
      credits.push(entry);
    }
  }

  // アルファベット順にソート
  return credits.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};

/**
 * ライセンス情報の生成メインロジック
 */
const generateLicenses = (): void => {
  console.log('ライセンス情報を生成中...');

  // pnpm から全依存関係（バンドル対象を含む）のライセンス情報を取得
  const json = execSync('pnpm licenses list --prod --json').toString();
  const credits = parseLicenses(json);

  // 出力先ディレクトリの確保
  if (!existsSync('resources')) {
    mkdirSync('resources', { recursive: true });
  }

  // JSON として保存
  const outputPath = join('resources', 'licenses.json');
  writeFileSync(outputPath, JSON.stringify(credits, null, 2), 'utf8');

  console.log(`${credits.length} 件のライセンス情報を ${outputPath} に生成`);
};

try {
  generateLicenses();
} catch (error) {
  console.error('ライセンス情報の生成中にエラーが発生:', error);
  process.exit(1);
}
