export class Report {
  project_id: number;
  project_reference: string;
  project_description: string;
  project_created_by: string;
  inputfiles: InputFiles[] = [];

  constructor() {
      this.inputfiles.push(new InputFiles());
  }
}

export class InputFiles {
  name: string;
  hashtypeId: number;
  hashCount: number;
  cracked: string;
  dispatched_keyspace: number;
}
