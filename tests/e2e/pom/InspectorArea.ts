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
  readonly trackNumberInput: Locator;
  readonly discNumberInput: Locator;
  readonly discTotalInput: Locator;
  readonly trackTotalInput: Locator;
  readonly dateInput: Locator;
  readonly catalogNumberInput: Locator;
  readonly coverArt: Locator;
  readonly coverPlaceholder: Locator;
  readonly coverPlaceholderText: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId('inspector');
    this.dropZone = new DropZoneArea(page, page.getByTestId('inspector-drop-zone'));
    this.emptyState = page.getByTestId('inspector-empty');
    this.coverArt = page.getByTestId('cover-art');
    this.coverPlaceholder = page.getByTestId('cover-placeholder');
    this.coverPlaceholderText = page.getByTestId('cover-placeholder-text');

    // 単一値フィールド (ラベルで検索するため root 経由を維持)
    this.titleInput = this.root.getByLabel('Title', { exact: true });
    this.albumInput = this.root.getByLabel('Album', { exact: true });
    this.genreInput = this.root.getByLabel('Genre', { exact: true });
    this.dateInput = this.root.getByLabel('Date', { exact: true });
    this.trackNumberInput = this.root.getByLabel('Track', { exact: true });
    this.trackTotalInput = this.root.getByPlaceholder('Tracks', { exact: true });
    this.discNumberInput = this.root.getByLabel('Disc', { exact: true });
    this.discTotalInput = this.root.getByPlaceholder('Discs', { exact: true });
    this.catalogNumberInput = this.root.getByLabel('Catalog Number', { exact: true });

    // マルチバリューフィールド (MultiValueField.svelte)
    this.artistInput = this.root.getByLabel('Artist', { exact: true });
    this.albumArtistInput = this.root.getByLabel('Album Artist', { exact: true });
  }

  /**
   * アーティストの値を取得します。
   */
  async getArtists(): Promise<string[]> {
    return this.getMultiFieldValues('Artist');
  }

  /**
   * アルバムアーティストの値を取得します。
   */
  async getAlbumArtists(): Promise<string[]> {
    return this.getMultiFieldValues('Album Artist');
  }

  /**
   * ジャンルの値を取得します。
   */
  async getGenres(): Promise<string[]> {
    return this.getMultiFieldValues('Genre');
  }

  /**
   * 指定したラベルを持つ MultiValueField または BadgeField のすべての入力値を取得します。
   */
  private async getMultiFieldValues(label: string): Promise<string[]> {
    const testIdBase = label.toLowerCase().replace(/\s+/g, '-');
    const container = this.root.getByTestId(`${testIdBase}-field`);
    await container.waitFor({ state: 'visible', timeout: 10000 });

    const classList = (await container.getAttribute('class')) || '';

    if (classList.includes('multi-value-field')) {
      // MultiValueField (input要素) の場合
      const inputs = container.locator('input[type="text"]');
      return inputs.evaluateAll((elems) => elems.map((el) => (el as HTMLInputElement).value));
    }

    if (classList.includes('badge-field')) {
      // BadgeField (badge-item要素) の場合
      // Xボタンなどのテキストを除外するため、badge内のテキストのみを取得
      return container.getByTestId('badge-item').allInnerTexts();
    }

    return [];
  }
}
