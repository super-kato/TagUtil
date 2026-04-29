import { join } from 'path';
import { expect, e2eTest as test } from '../fixtures';

test.describe('タグ読み込みテスト', () => {
  test('FLACファイルのすべてのタグが正常に読み込まれ、グリッドとインスペクターに反映されること', async ({
    mainPage,
    testDataDir
  }) => {
    // 1. 画像ありファイル (full-tags.flac)
    const fullTagsPath = join(testDataDir, 'full-tags.flac');
    // 2. 画像なしファイル (track.flac)
    const noArtPath = join(testDataDir, 'track.flac');

    // ファイルをドロップ
    await mainPage.dropZone.dropFiles([fullTagsPath, noArtPath]);

    // 2ファイル読み込み完了を待機
    await expect(mainPage.trackGrid.rows).toHaveCount(2, { timeout: 10000 });

    // --- full-tags.flac (index 0) の検証 ---
    await mainPage.trackGrid.selectTrack(0);

    // TrackGrid の検証 (表示対象の Title, Artist)
    const titles = await mainPage.trackGrid.getTitles();
    expect(titles).toContain('Test Title');

    // Inspector の検証 (画像があること)
    await expect(mainPage.inspector.coverArt).toBeVisible();
    await expect(mainPage.inspector.coverPlaceholder).not.toBeVisible();

    // Inspector の検証 (単一値フィールド)
    await expect(mainPage.inspector.titleInput).toHaveValue('Test Title');
    await expect(mainPage.inspector.albumInput).toHaveValue('Test Album');

    // インスペクターの検証 (MultiValueField / BadgeField)
    expect(await mainPage.inspector.getArtists()).toEqual(['Test Artist 1', 'Test Artist 2']);
    expect(await mainPage.inspector.getAlbumArtists()).toEqual([
      'Test Album Artist 1',
      'Test Album Artist 2'
    ]);
    expect(await mainPage.inspector.getGenres()).toEqual(['Rock', 'Pop']);

    // --- track.flac (index 1) の検証 ---
    await mainPage.trackGrid.selectTrack(1);

    // Inspector の検証 (画像がなく、プレースホルダーが表示されていること)
    await expect(mainPage.inspector.coverArt).not.toBeVisible();
    await expect(mainPage.inspector.coverPlaceholder).toBeVisible();
    await expect(mainPage.inspector.coverPlaceholderText).toHaveText('No Artwork');

    // (track.flac はカバーアートがなく、タイトルが 'Test Plain Title' であることを確認)
    await expect(mainPage.inspector.titleInput).toHaveValue('Test Plain Title');
  });
});
