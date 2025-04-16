declare module 'pdfmake/build/pdfmake' {
  const pdfMake: {
    vfs: any;
    createPdf: (docDefinition: any) => any;
  };
  export = pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfsFonts: {
    vfs: any;
  };
  export = vfsFonts;
}
