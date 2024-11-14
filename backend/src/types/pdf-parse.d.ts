declare module 'pdf-parse' {
    interface PdfParseResult {
      numpages: number;
      numrender: number;
      info: object;
      metadata: object;
      text: string;
      version: string;
    }
  
    function pdfParse(data: Buffer): Promise<PdfParseResult>;
  
    export = pdfParse;
  }
  