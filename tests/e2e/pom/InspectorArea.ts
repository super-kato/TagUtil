import { type Locator, type Page } from '@playwright/test';

export class InspectorArea {
  readonly root: Locator;
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
    this.emptyState = this.root.locator('.empty-inspector');
    
    // 単一値フィールド
    this.titleInput = this.root.locator('input#title');
    this.albumInput = this.root.locator('input#album');
    this.genreInput = this.root.locator('input#genre');
    this.yearInput = this.root.locator('input#year');
    this.trackNumberInput = this.root.locator('input#track');
    this.discNumberInput = this.root.locator('input#disc');

    // マルチバリューフィールド (MultiValueField.svelte)
    // ID は label 名に基づいて生成される
    this.artistInput = this.root.locator('input#multi-field-Artist');
    this.albumArtistInput = this.root.locator('input#multi-field-Album\\ Artist');
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
