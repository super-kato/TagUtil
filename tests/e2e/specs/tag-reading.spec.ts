import { join } from 'path';
import { expect, e2eTest as test } from '../fixtures';

test.describe('タグ読み込みテスト', () => {
  test('すべてのタグ（画像含む）が設定されたFLACファイルを正常に読み込めること', async ({
    mainPage,
    testDataDir
  }) => {
    const fullTagsPath = join(testDataDir, 'full-tags.flac');
    await mainPage.dropZone.dropFiles([fullTagsPath]);

    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.trackGrid.selectTrack(0);

    // TrackGrid の検証
    const titles = await mainPage.trackGrid.getTitles();
    expect(titles).toContain('Test Title');

    // Inspector の検証 (画像あり)
    await expect(mainPage.inspector.coverArt).toBeVisible();
    await expect(mainPage.inspector.coverPlaceholder).not.toBeVisible();

    // Inspector の検証 (各フィールド)
    await expect(mainPage.inspector.titleInput).toHaveValue('Test Title');
    await expect(mainPage.inspector.albumInput).toHaveValue('Test Album');
    expect(await mainPage.inspector.getArtists()).toEqual(['Test Artist 1', 'Test Artist 2']);
    expect(await mainPage.inspector.getAlbumArtists()).toEqual([
      'Test Album Artist 1',
      'Test Album Artist 2'
    ]);
    expect(await mainPage.inspector.getGenres()).toEqual(['Rock', 'Pop']);
  });

  test('タグが一切設定されていないFLACファイルを正常に読み込めること', async ({
    mainPage,
    testDataDir
  }) => {
    const noArtPath = join(testDataDir, 'track.flac');
    await mainPage.dropZone.dropFiles([noArtPath]);

    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.trackGrid.selectTrack(0);

    // Inspector の検証 (画像なし/プレースホルダー表示)
    await expect(mainPage.inspector.coverArt).not.toBeVisible();
    await expect(mainPage.inspector.coverPlaceholder).toBeVisible();
    await expect(mainPage.inspector.coverPlaceholderText).toHaveText('No Artwork');

    // すべてのメタデータが空であることを確認
    await expect(mainPage.inspector.titleInput).toHaveValue('');
    await expect(mainPage.inspector.albumInput).toHaveValue('');
    expect(await mainPage.inspector.getArtists()).toEqual([]);
    expect(await mainPage.inspector.getGenres()).toEqual([]);
  });
});
