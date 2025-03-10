export interface ConfigsData {
  type: string;
  id: number;
  attributes: DataAttributes;
  links?: DataLinks;
  relationships?: Relationships;
}

export interface DataAttributes {
  configSectionId: number;
  item: string;
  value: string;
}

export interface DataLinks {
  self: string;
}

export interface Relationships {
  configSection: ConfigSection;
}

export interface ConfigSection {
  links: ConfigSectionLinks;
}

export interface ConfigSectionLinks {
  self: string;
  related: string;
}
