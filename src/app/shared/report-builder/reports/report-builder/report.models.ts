import { SafeHtml } from '@angular/platform-browser';

export interface ReportTableColumn {
  id: number;
  dataKey: string;
  render?: (data: Record<string, unknown>) => SafeHtml;
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
export type ReportSection =
  | ReportTableSection
  | ReportBreakSection
  | ReportTitleSection
  | ReportSubtitleSection;

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
    info_header_text: Record<string, unknown>;
    global_style: Record<string, Record<string, unknown>>;
    img_logo: Record<string, unknown>;
    img_background: Record<string, unknown>;
    [key: string]: unknown;
  };
  cover_page: Record<string, Record<string, unknown>>;
  pages: Record<string, Record<string, unknown>>;
}

/**
 * Contract for data sources that the report builder can consume.
 */
export interface ReportDataProvider {
  getOriginalData(): ReportSection[];
}
