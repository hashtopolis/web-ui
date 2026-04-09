declare module 'pdfmake/build/pdfmake' {
  interface PdfMakeResult {
    open: () => void;
    download: (defaultFileName?: string) => void;
    print: () => void;
  }

  const pdfMake: {
    vfs: Record<string, string>;
    createPdf: (docDefinition: Record<string, unknown>) => PdfMakeResult;
  };
  export = pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfsFonts: {
    vfs: Record<string, string>;
  };
  export = vfsFonts;
}
