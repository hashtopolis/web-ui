import { AccessGroup } from './access-group.model'

export interface Filetype {
  fileId: number
  filename: string
  size: number
  isSecret: number
  fileType: number
  accessGroupId: number
  lineCount: number
  accessGroup: AccessGroup
}

export interface UpdateFileType {
  fileId: number
  filename: string
  fileType: number
  accessGroupId: number
}

export interface UploadFileTUS {
  filename: string
  progress: number
  hash: string
  uuid: string
}
