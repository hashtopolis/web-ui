export interface Filetype {
    fileId: number,
    filename: string,
    size: number,
    isSecret: number,
    fileType: number,
    accessGroupId: number,
    lineCount:number
    accessGroup: {
      accessGroupId: number,
      groupName: string
    }
}

export interface UpdateFileType {
  fileId: number,
  filename: string,
  fileType: number,
  accessGroupId: number,
}

export interface UploadFileTUS {
  filename: string;
  progress: number;
  hash: string;
  uuid: string;
}
