import { SafeHtml } from '@angular/platform-browser';

/** Base pdfMake text styling properties */
export interface PdfTextElement {
  text?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  margin?: number[];
  fontSize?: number;
  bold?: boolean;
}

/** Header text element with page-control properties */
export interface ReportHeaderText extends PdfTextElement {
  allpages?: boolean;
  startAt?: number;
}

/** Image element used for logos, backgrounds, letterheads */
export interface ReportImageConfig {
  enable?: boolean;
  img_path?: string;
  image?: string;
  width?: number;
  alignment?: string;
  margin?: number[];
}

/** Text element on cover/content pages with gap control */
export interface PdfCoverTextElement extends PdfTextElement {
  gapPos?: 'top' | 'bottom';
  gapLines?: number;
  border?: (boolean | number)[];
}

/** Any element that can appear in a cover page or content page section */
export type CoverPageElement = PdfCoverTextElement | ReportImageConfig;

/** Table header styling */
export interface PdfTableHeaderStyle {
  fillColor?: string;
  border?: (boolean | number)[];
  margin?: number[];
  textTransform?: string;
}

/** Named global styles map */
export interface ReportGlobalStyles {
  title?: PdfTextElement;
  subtitle?: PdfTextElement;
  text?: PdfTextElement;
  tables?: { tableHeader?: PdfTableHeaderStyle };
  [key: string]: PdfTextElement | { tableHeader?: PdfTableHeaderStyle } | undefined;
}

export interface ReportTableColumn {
  id: number;
  dataKey: string;
  render?: (data: Record<string, string | number | boolean>) => SafeHtml;
}

/**
 * A text item with margin, used in PDF lists.
 */
export interface ReportTextItem {
  text: string;
  margin: number[];
}

/**
 * A report section containing a data table.
 */
export interface ReportTableSection {
  title: string;
  table: { tableColumns: string[]; tableValues: unknown[] };
}

/**
 * A report section containing a page break.
 */
export interface ReportBreakSection {
  break: number;
}

/**
 * A report section containing only a title.
 */
export interface ReportTitleSection {
  title: string;
}

/**
 * A report section containing a subtitle and optional list.
 */
export interface ReportSubtitleSection {
  subtitle: string;
  ul?: ReportTextItem[];
}

/**
 * Union of all possible report section shapes.
 */
export type ReportSection = ReportTableSection | ReportBreakSection | ReportTitleSection | ReportSubtitleSection;

/**
 * Form values produced by the report builder form.
 */
export interface ReportFormValues {
  cover_page: boolean;
  cover_page_letter_head: boolean;
  title: string;
  info_header_text: string;
  info_cover_body_1: string;
  info_cover_body_2: string;
  reference: string;
  info_cover_body_3: string;
  info_cover_body_4: string;
  info_cover_body_5: string;
  location_date: string;
  info_cover_footer_1: string;
  info_cover_footer_2: string;
  info_cover_footer_3: string;
  project_name: string;
  project_description: string;
  userpassword: string;
  ownerpassword: string;
}

/**
 * Structure of a report template loaded from JSON assets.
 */
export interface ReportTemplate {
  settings: {
    userpassword: string;
    ownerpassword: string;
    pageSize?: string;
    pageMargins?: number[];
    info_header_text: ReportHeaderText;
    global_style: ReportGlobalStyles;
    img_logo: ReportImageConfig;
    img_background: ReportImageConfig;
  };
  cover_page: Record<string, CoverPageElement>;
  pages: Record<string, CoverPageElement>;
}

/**
 * Contract for data sources that the report builder can consume.
 */
export interface ReportDataProvider {
  getOriginalData(): ReportSection[];
}
