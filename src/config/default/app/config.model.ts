// Interfaces for app config

export interface BrandConfig {
  logo: string;
  logored: string;
  name: string;
  height: string;
  width: string;
  heightred: string;
  widthred: string;
}

export interface HeaderConfig {
  brand: BrandConfig;
}

export interface FooterConfig {
  copyright: string;
  footer_link_one: FooterLink;
  footer_link_two: FooterLink;
  footer_link_three: FooterLink;
}

export interface FooterLink {
  link: string;
  name: string;
}

export interface Config {
  prodApiEndpoint: string;
  prodApiMaxResults: number;
  agentURL: string;
  agentdownloadURL: string;
  appName: string;
  favicon: string;
  header: HeaderConfig;
  footer: FooterConfig;
  agents: {
    statusOrderBy: string;
    statusOrderByName: string;
  };
  tasks: {
    priority: number;
    maxAgents: number;
    chunkSize: number;
  };
  chunkSizeTUS: number;
}
