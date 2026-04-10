interface HashcatOptions {
  debug: boolean;
  ruleFiles: string[];
  attackType: number;
  hashMode: number;
  posArgs: string[];
  customCharset1: string;
  customCharset2: string;
  customCharset3: string;
  customCharset4: string;
  unrecognizedFlag: string[];
}

interface OptionParserRule {
  name: string;
  short: string | undefined;
  long: string;
  decl: string;
  desc: string | undefined;
  optional_arg: boolean | undefined;
  filter: ((value: string, tokens?: string[]) => unknown) | undefined;
}

interface OptionParser {
  banner: string;
  options_title: string;
  parse(args: string[]): string[];
  on(fn: (opt: string) => void): void;
  on(value: number, fn: (opt: string) => void): void;
  on(name: string, fn: (name: string, value?: string | number) => void): void;
  filter(name: string, fn: (value: string, tokens?: string[]) => unknown): void;
  options(): OptionParserRule[];
  halt(fn?: (tokens: string[]) => unknown): void;
  toString(): string;
}

declare let options: HashcatOptions;
declare let defaultOptions: HashcatOptions;
declare let parser: OptionParser;
