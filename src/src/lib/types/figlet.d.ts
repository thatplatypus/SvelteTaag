declare module 'figlet' {
  interface FigletOptions {
    font?: string;
    horizontalLayout?: string;
    verticalLayout?: string;
    width?: number;
    whitespaceBreak?: boolean;
  }

  type FigletCallback = (err: Error | null, result?: string) => void;
  type FontCallback = (err: Error | null, fontList?: string[]) => void;
  
  export function text(text: string, callback: FigletCallback): void;
  export function text(text: string, options: FigletOptions, callback: FigletCallback): void;
  export function textSync(text: string, options?: FigletOptions): string;
  
  export function fonts(callback: FontCallback): void;
  export function fontsSync(): string[];
  
  export function metadata(fontName: string, callback: (err: Error | null, options?: Record<string, any>, headerComment?: string) => void): void;
  export function metadataSync(fontName: string): { options: Record<string, any>, headerComment: string };
  
  export function parseFont(name: string, fontData: string): void;
  
  export function loadFont(name: string, fontPath: string, callback: (err: Error | null) => void): void;
  export function loadFontSync(name: string, fontPath: string): void;
  
  export function preloadFonts(fontList: string[], callback: (err: Error | null) => void): void;
  
  export function defaults(options: FigletOptions & { fontPath?: string }): void;
  
  export default {
    text,
    textSync,
    fonts,
    fontsSync,
    metadata,
    metadataSync,
    parseFont,
    loadFont,
    loadFontSync,
    preloadFonts,
    defaults
  };
} 