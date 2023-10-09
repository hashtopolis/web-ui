import { Injectable, ViewChild, ChangeDetectorRef} from '@angular/core';
import { environment } from './../../../../environments/environment';
import * as tus from 'tus-js-client';
import { Observable, Subject, of } from 'rxjs';
import { ConfigService } from '../shared/config.service';

import { UploadFileTUS } from '../../_models/files';
import { SERV } from '../../../core/_services/main.config';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { GlobalService } from '../main.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UploadTUSService {

    private endpoint = '/helper/importFile';
    private chunked = environment.config.chunkSizeTUS;
    private userData: {_token: string} = JSON.parse(localStorage.getItem('userData'));

    private tusUpload: tus.Upload | null = null;

    constructor(
      private cs: ConfigService,
      private gs: GlobalService,
      private router: Router
    ){}

    /**
     * Upload file using TUS protocol
     * @param file - File
     * @param filename - Name to upload
     * @param form - Creation form
     * @param redirect - Link to redirect
    **/

    // public fileStatusArr: UploadFileTUS[] = [];

    uploadFile(file: File, filename: string, path, form = null, redirect = null): Observable<number> {

      return new Observable<number>((observer) => {

        // Chunksize config default
        let chunkSize = this.chunked;
        if (Number.isNaN(chunkSize)) {
          chunkSize = Infinity
        }
        if (!tus.isSupported) {
          alert('This browser does not support uploads. Please use a modern browser instead.')
        }

        const upload = new tus.Upload(file, {
          endpoint: this.cs.getEndpoint() + this.endpoint,
          headers: {
            Authorization: `Bearer ${this.userData._token}`,
            'Tus-Resumable':'1.0.0',
            'Tus-Extension': 'checksum',
            'Tus-Checksum-Algorithm': 'md5,sha1,crc32'
          },
          // uploadUrl: fileURL, //Used for paused uploads
          retryDelays: [0, 3000, 6000, 9000, 12000],
          chunkSize: chunkSize,
          removeFingerprintOnSuccess: true,
          metadata: {
            filename,
            filetype: file.type,
          },
          onError: async (error) => {
            const exist = String(error).includes('exists!');
            if (exist) {
              const progress = 100;
              observer.next(progress);
              if(form !== null){
                this.gs.create(path,form).subscribe(() => {
                  this.router.navigate(redirect);
                });
              }
            } else {
              window.alert(`Failed because: ${error}`)
            }
            return false;
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const progress = (bytesUploaded / bytesTotal) * 100;
            observer.next(progress);
          },
          onSuccess: async () => {
            observer.complete();
            if(form !== null){
              this.gs.create(path,form).subscribe(() => {
                this.router.navigate(redirect);
              });
            }
          }
        })

        this.tusUpload = upload;

        checkPreviousuploads(upload).catch((error) => {
          console.error(error)
        })

      })

      async function checkPreviousuploads(upload) {
        let previousUploads = await upload.findPreviousUploads()

        // We only want to consider uploads in the last hour.
        const limitUpload = Date.now() - 3 * 60 * 60 * 1000
        previousUploads = previousUploads
          .map((upload) => {
            console.log('creationtome')
            upload.creationTime = new Date(upload.creationTime)
            return upload
          })
          .filter((upload) => upload.status > limitUpload)
          .sort((a, b) => b.creationTime - a.creationTime)

        // if (previousUploads.length === 0) {
        //   upload.start();
        // }

        // File already exist in the import folder, then return progress as 100

        upload.start();

      }

    }

    isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
      return (
        event.type === HttpEventType.DownloadProgress ||
        event.type === HttpEventType.UploadProgress
      );
    }
  }

