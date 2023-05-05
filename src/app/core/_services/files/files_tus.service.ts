import { Injectable, ViewChild, ChangeDetectorRef} from '@angular/core';
import { environment } from './../../../../environments/environment';
import * as tus from 'tus-js-client';
import { Subject } from 'rxjs';

import { UploadFileTUS } from '../../_models/files';

@Injectable({
  providedIn: 'root'
})

export class UploadTUSService {

    private endpoint = environment.config.prodApiEndpoint + '/ui/files/import';
    private chunked = environment.config.chunkSizeTUS;
    private userData: {_token: string} = JSON.parse(localStorage.getItem('userData'));

    private uploadStatus = new Subject<UploadFileTUS[]>();
    uploadProgress = this.uploadStatus.asObservable();

    fileStatusArr: UploadFileTUS[] = [];

/**
 * Upload file using TUS protocol
 * @param file - File
 * @param filename - Name to upload
 * @returns Object
**/
    uploadFile(file: File, filename: string, fileURL = null) {
      // Only continue if a file has been selected
      if (!file) {
        return
      }
      if (!tus.isSupported) {
        alert('This browser does not support uploads. Please use a modern browser instead.')
      }

      const fileStatus: UploadFileTUS = {filename, progress: 0, hash: '', uuid: ''};

      this.fileStatusArr.push(fileStatus);

      this.uploadStatus.next(this.fileStatusArr);

      const upload = new tus.Upload(file, {
        endpoint: this.endpoint,
        headers: {
          Authorization: `Bearer ${this.userData._token}`,
          'Tus-Resumable':'1.0.0',
          'Tus-Extension': 'checksum',
          'Tus-Checksum-Algorithm': 'md5,sha1,crc32'
        },
        uploadUrl: fileURL,
        retryDelays: [0, 3000, 6000, 9000, 12000],
        chunkSize: this.chunked,
        metadata: {
          filename,
          filetype: file.type,
          // userId: "1234567"
        },
        onError: async (error) => {
          console.log(error)
          if (error) {
            if (window.confirm(`Failed because: ${error}\nDo you want to retry?`)) {
              upload.start()
              return false;
            }
          } else {
            window.alert(`Failed because: ${error}`)
          }
          return false;
        },
        onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
          this.fileStatusArr.forEach(value => {
            if (value.filename === filename) {
              value.progress = Math.floor(bytesAccepted / bytesTotal * 100);
              value.uuid = upload.url.split('/').slice(-1)[0];
            }
          });
          this.uploadStatus.next(this.fileStatusArr);
        },
        onSuccess: async () => {
          this.fileStatusArr.forEach(value => {
            if (value.filename === filename) {
              value.progress = 100;
            }
          });
          this.uploadStatus.next(this.fileStatusArr);
          return true;
        }
      });
      upload.start();
    }

    cancelUpload(filename: string){

    }
  }

