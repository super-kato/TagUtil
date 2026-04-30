import { join } from 'path';
import { expect, e2eTest as test } from '../fixtures';

test.describe('タグ書き込みテスト', () => {
  test.slow(); // タイムアウトを3倍に延長

  test('すべてのサポートされているタグを単一のFLACファイルに書き込み、正しく保存されること', async ({
    mainPage,
    testDataDir
  }) => {
    const trackPath = join(testDataDir, 'track.flac');
    await mainPage.dropZone.dropFiles([trackPath]);

    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.trackGrid.selectTrack(0);

    // 全てのフィールドに値を設定
    await mainPage.inspector.basicFields.setTitle('Full Tag Title');
    await mainPage.inspector.basicFields.setAlbum('Full Tag Album');
    await mainPage.inspector.numericFields.setDate('2025');
    await mainPage.inspector.numericFields.setTrackNumber('7');
    await mainPage.inspector.numericFields.setTrackTotal('12');
    await mainPage.inspector.numericFields.setDiscNumber('1');
    await mainPage.inspector.numericFields.setDiscTotal('2');
    await mainPage.inspector.basicFields.setCatalogNumber('TEST-999');
    await mainPage.inspector.basicFields.setArtists(['Artist A', 'Artist B']);
    await mainPage.inspector.basicFields.setAlbumArtists(['Album Artist X']);
    await mainPage.inspector.genres.setGenres(['Electronic', 'Ambient']);

    // 保存実行
    await expect(mainPage.toolbar.saveChangesButton).toBeEnabled();
    await mainPage.toolbar.saveChangesButton.click();
    await expect(mainPage.toolbar.saveChangesButton).toBeDisabled({ timeout: 15000 });

    // アプリをリロードして再度読み込み、保存されたことを確認する
    await mainPage.page.reload();
    await mainPage.dropZone.dropFiles([trackPath]);

    await expect(mainPage.trackGrid.rows).toHaveCount(1, { timeout: 10000 });
    await mainPage.trackGrid.selectTrack(0);

    // 全てのフィールドの値を検証
    await expect(mainPage.inspector.basicFields.titleInput).toHaveValue('Full Tag Title');
    await expect(mainPage.inspector.basicFields.albumInput).toHaveValue('Full Tag Album');
    await expect(mainPage.inspector.numericFields.dateInput).toHaveValue('2025');
    await expect(mainPage.inspector.numericFields.trackNumberInput).toHaveValue('7');
    await expect(mainPage.inspector.numericFields.trackTotalInput).toHaveValue('12');
    await expect(mainPage.inspector.numericFields.discNumberInput).toHaveValue('1');
    await expect(mainPage.inspector.numericFields.discTotalInput).toHaveValue('2');
    await expect(mainPage.inspector.basicFields.catalogNumberInput).toHaveValue('TEST-999');

    expect(await mainPage.inspector.basicFields.getArtists()).toEqual(['Artist A', 'Artist B']);
    expect(await mainPage.inspector.basicFields.getAlbumArtists()).toEqual(['Album Artist X']);
    expect(await mainPage.inspector.genres.getGenres()).toEqual(['Electronic', 'Ambient']);
  });

  test('複数のトラックに対して一括編集可能なすべてのフィールドを編集して保存できること', async ({
    mainPage,
    testDataDir
  }) => {
    const track1 = join(testDataDir, 'track.flac');
    const track2 = join(testDataDir, 'full-tags.flac');
    await mainPage.dropZone.dropFiles([track1, track2]);

    await expect(mainPage.trackGrid.rows).toHaveCount(2, { timeout: 10000 });

    // 全選択
    await mainPage.trackGrid.selectAll();

    // 一括編集可能なフィールドを設定
    await mainPage.inspector.basicFields.setAlbum('Batch Album');
    await mainPage.inspector.numericFields.setDate('2030');
    await mainPage.inspector.numericFields.setTrackTotal('20');
    await mainPage.inspector.numericFields.setDiscNumber('3');
    await mainPage.inspector.numericFields.setDiscTotal('5');
    await mainPage.inspector.basicFields.setCatalogNumber('BATCH-COLLECTION');
    await mainPage.inspector.basicFields.setArtists(['Common Artist']);
    await mainPage.inspector.basicFields.setAlbumArtists(['Common Album Artist']);
    await mainPage.inspector.genres.setGenres(['Classical']);

    // 保存
    await mainPage.toolbar.saveChangesButton.click();
    await expect(mainPage.toolbar.saveChangesButton).toBeDisabled({ timeout: 15000 });

    // リロードして確認
    await mainPage.page.reload();
    await mainPage.dropZone.dropFiles([track1, track2]);

    // 両方のトラックで値が更新されていることを確認
    for (let i = 0; i < 2; i++) {
      await mainPage.trackGrid.selectTrack(i);
      await expect(mainPage.inspector.basicFields.albumInput).toHaveValue('Batch Album');
      await expect(mainPage.inspector.numericFields.dateInput).toHaveValue('2030');
      await expect(mainPage.inspector.numericFields.trackTotalInput).toHaveValue('20');
      await expect(mainPage.inspector.numericFields.discNumberInput).toHaveValue('3');
      await expect(mainPage.inspector.numericFields.discTotalInput).toHaveValue('5');
      await expect(mainPage.inspector.basicFields.catalogNumberInput).toHaveValue(
        'BATCH-COLLECTION'
      );

      expect(await mainPage.inspector.basicFields.getArtists()).toEqual(['Common Artist']);
      expect(await mainPage.inspector.basicFields.getAlbumArtists()).toEqual([
        'Common Album Artist'
      ]);
      expect(await mainPage.inspector.genres.getGenres()).toEqual(['Classical']);
    }
  });
});
