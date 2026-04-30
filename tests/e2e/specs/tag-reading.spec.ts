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
    await expect(mainPage.inspector.artwork.coverArt).toBeVisible();
    await expect(mainPage.inspector.artwork.coverPlaceholder).not.toBeVisible();

    // Inspector の検証 (各フィールド)
    await expect(mainPage.inspector.basicFields.titleInput).toHaveValue('Test Title');
    await expect(mainPage.inspector.basicFields.albumInput).toHaveValue('Test Album');
    await expect(mainPage.inspector.numericFields.dateInput).toHaveValue('2024');
    await expect(mainPage.inspector.numericFields.trackNumberInput).toHaveValue('1');
    await expect(mainPage.inspector.numericFields.trackTotalInput).toHaveValue('10');
    await expect(mainPage.inspector.numericFields.discNumberInput).toHaveValue('2');
    await expect(mainPage.inspector.numericFields.discTotalInput).toHaveValue('3');
    await expect(mainPage.inspector.basicFields.catalogNumberInput).toHaveValue('CAT-001');

    expect(await mainPage.inspector.basicFields.getArtists()).toEqual([
      'Test Artist 1',
      'Test Artist 2'
    ]);
    expect(await mainPage.inspector.basicFields.getAlbumArtists()).toEqual([
      'Test Album Artist 1',
      'Test Album Artist 2'
    ]);
    expect(await mainPage.inspector.genres.getGenres()).toEqual(['Rock', 'Pop']);
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
    await expect(mainPage.inspector.artwork.coverArt).not.toBeVisible();
    await expect(mainPage.inspector.artwork.coverPlaceholder).toBeVisible();
    await expect(mainPage.inspector.artwork.coverPlaceholderText).toHaveText('No Artwork');

    // すべてのメタデータが空であることを確認
    await expect(mainPage.inspector.basicFields.titleInput).toHaveValue('');
    await expect(mainPage.inspector.basicFields.albumInput).toHaveValue('');
    await expect(mainPage.inspector.numericFields.dateInput).toHaveValue('');
    await expect(mainPage.inspector.numericFields.trackNumberInput).toHaveValue('');
    await expect(mainPage.inspector.numericFields.trackTotalInput).toHaveValue('');
    await expect(mainPage.inspector.numericFields.discNumberInput).toHaveValue('');
    await expect(mainPage.inspector.numericFields.discTotalInput).toHaveValue('');
    await expect(mainPage.inspector.basicFields.catalogNumberInput).toHaveValue('');

    expect(await mainPage.inspector.basicFields.getArtists()).toEqual([]);
    expect(await mainPage.inspector.genres.getGenres()).toEqual([]);
  });
});
