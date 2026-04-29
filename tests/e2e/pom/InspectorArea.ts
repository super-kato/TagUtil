import { type Locator, type Page } from '@playwright/test';
import { DropZoneArea } from './DropZoneArea';

export class InspectorArea {
  readonly root: Locator;
  readonly dropZone: DropZoneArea;
  readonly emptyState: Locator;
  readonly titleInput: Locator;
  readonly artistInput: Locator;
  readonly albumInput: Locator;
  readonly albumArtistInput: Locator;
  readonly genreInput: Locator;
  readonly yearInput: Locator;
  readonly trackNumberInput: Locator;
  readonly discNumberInput: Locator;

  constructor(page: Page) {
    this.root = page.locator('aside.inspector');
    this.dropZone = new DropZoneArea(page, page.getByTestId('inspector-drop-zone'));
    this.emptyState = this.root.locator('.empty-inspector');

    // 単一値フィールド
    this.titleInput = this.root.getByLabel('Title', { exact: true });
    this.albumInput = this.root.getByLabel('Album', { exact: true });
    this.genreInput = this.root.getByLabel('Genre', { exact: true });
    this.yearInput = this.root.getByLabel('Year', { exact: true });
    this.trackNumberInput = this.root.getByLabel('Track', { exact: true });
    this.discNumberInput = this.root.getByLabel('Disc', { exact: true });

    // マルチバリューフィールド (MultiValueField.svelte)
    this.artistInput = this.root.getByLabel('Artist', { exact: true });
    this.albumArtistInput = this.root.getByLabel('Album Artist', { exact: true });
  }

  async isEditingEnabled(): Promise<boolean> {
    return await this.emptyState.isHidden();
  }

  /**
   * 主要なメタデータを一括で取得します。
   */
  async getMetadata(): Promise<{ title: string; artist: string; album: string }> {
    return {
      title: await this.titleInput.inputValue(),
      artist: await this.artistInput.inputValue(),
      album: await this.albumInput.inputValue()
    };
  }

  /**
   * タイトルを設定します。
   */
  async setTitle(value: string): Promise<void> {
    await this.titleInput.fill(value);
  }

  /**
   * アーティストを設定します。
   */
  async setArtist(value: string): Promise<void> {
    await this.artistInput.fill(value);
  }

  /**
   * アルバムを設定します。
   */
  async setAlbum(value: string): Promise<void> {
    await this.albumInput.fill(value);
  }
}
