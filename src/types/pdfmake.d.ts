declare module 'pdfmake/build/pdfmake' {
  import { PdfDocumentDefinition } from '@src/app/shared/report-builder/reports/report-builder/report.models';

  interface PdfMakeResult {
    open: () => void;
    download: (defaultFileName?: string) => void;
    print: () => void;
  }

  const pdfMake: {
    vfs: Record<string, string>;
    createPdf: (docDefinition: PdfDocumentDefinition) => PdfMakeResult;
  };
  export = pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfsFonts: {
    vfs: Record<string, string>;
  };
  export = vfsFonts;
}
