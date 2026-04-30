import { type Locator, type Page } from '@playwright/test';
import { DropZoneArea } from './DropZoneArea';
import { ArtworkSection } from './inspector/ArtworkSection';
import { BasicFieldsSection } from './inspector/BasicFieldsSection';
import { GenreSection } from './inspector/GenreSection';
import { NumericFieldsSection } from './inspector/NumericFieldsSection';

export class InspectorArea {
  readonly root: Locator;
  readonly dropZone: DropZoneArea;
  readonly emptyState: Locator;

  readonly artwork: ArtworkSection;
  readonly basicFields: BasicFieldsSection;
  readonly numericFields: NumericFieldsSection;
  readonly genres: GenreSection;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId('inspector');
    this.dropZone = new DropZoneArea(page, page.getByTestId('inspector-drop-zone'));
    this.emptyState = page.getByTestId('inspector-empty');

    this.artwork = new ArtworkSection(page, this.root);
    this.basicFields = new BasicFieldsSection(page, this.root);
    this.numericFields = new NumericFieldsSection(page, this.root);
    this.genres = new GenreSection(page, this.root);
  }
}
