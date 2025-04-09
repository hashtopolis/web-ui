import * as tus from 'tus-js-client';
import { Observable } from 'rxjs';

import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from '@models/auth-user.model';

import { LocalStorageService } from '@services/storage/local-storage.service';
import { ConfigService } from '@services/shared/config.service';
import { GlobalService } from '@services/main.service';
import { ServiceConfig } from '@services/main.config';

import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadTUSService {
  /**
   * The API endpoint helper for uploading files using the TUS protocol.
   */
  private endpoint = '/helper/importFile';

  /**
   * The chunk size used for uploading files. It is obtained from the environment configuration.
   */
  private chunked = environment.config.chunkSizeTUS;

  /**
   * The storage key for retrieving user data from local storage.
   */
  static readonly STORAGE_KEY = 'userData';

  /**
   * The user authentication token used for setting the Authorization header in file uploads.
   */
  private _token: string;

  /**
   * Represents the ongoing TUS upload. It is initialized as null.
   */
  private tusUpload: tus.Upload | null = null;

  /**
   * Constructs an instance of UploadTUSService.
   * @param storage - The LocalStorageService used for storing and retrieving user data.
   * @param cs - The ConfigService for fetching endpoint configurations.
   * @param gs - The GlobalService for handling global functionalities.
   * @param router - The Angular Router service for navigation.
   */
  constructor(
    protected storage: LocalStorageService<AuthData>,
    private cs: ConfigService,
    private gs: GlobalService,
    private router: Router
  ) {
    /**
     * Retrieves user data from local storage using the STORAGE_KEY and sets the authentication token.
     */
    const userData: AuthData = this.storage.getItem(UploadTUSService.STORAGE_KEY);
    this._token = userData._token;
  }

  /**
   * Upload file using TUS protocol.
   * @param file - File to upload.
   * @param filename - Name to upload.
   * @param serviceConfig - Service (URL and Resource) for which upload should be made
   * @param form - Creation form.
   * @param redirect - Link to redirect.
   * @returns Observable<number> representing the upload progress.
   */
  // public fileStatusArr: UploadFileTUS[] = [];

  uploadFile(
    file: File,
    filename: string,
    serviceConfig: ServiceConfig,
    form = null,
    redirect = null
  ): Observable<number> {
    return new Observable<number>((observer) => {
      // Get Chunksize config default
      let chunkSize = this.chunked;
      if (Number.isNaN(chunkSize)) {
        chunkSize = Infinity;
      }
      if (!tus.isSupported) {
        alert('This browser does not support uploads. Please use a modern browser instead.');
      }
      const upload = new tus.Upload(file, {
        endpoint: this.cs.getEndpoint() + this.endpoint,
        headers: {
          Authorization: `Bearer ${this._token}`,
          'Tus-Resumable': '1.0.0',
          'Tus-Extension': 'checksum',
          'Tus-Checksum-Algorithm': 'md5,sha1,crc32'
        },
        // uploadUrl: fileURL, //Used for paused uploads
        retryDelays: [0, 3000, 6000, 9000, 12000],
        chunkSize: chunkSize,
        removeFingerprintOnSuccess: true,
        metadata: {
          filename,
          filetype: file.type
        },
        onError: async (error) => {
          const exist = String(error).includes('exists!');
          if (exist) {
            const progress = 100;
            observer.next(progress);
            if (form !== null) {
              this.gs.create(serviceConfig, form).subscribe(() => {
                this.router.navigate(redirect);
              });
            }
          } else {
            window.alert(`Failed because: ${error}`);
          }
          return false;
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const progress = (bytesUploaded / bytesTotal) * 100;
          observer.next(progress);
        },
        onSuccess: async () => {
          observer.complete();
          if (form !== null) {
            this.gs.create(serviceConfig, form).subscribe(() => {
              this.router.navigate(redirect);
            });
          }
        }
      });

      this.tusUpload = upload;

      checkPreviousuploads(upload).catch((error) => {
        console.error(error);
      });
    });

    async function checkPreviousuploads(upload) {
      let previousUploads = await upload.findPreviousUploads();

      // We only want to consider uploads in the last hour.
      const limitUpload = Date.now() - 3 * 60 * 60 * 1000;
      previousUploads = previousUploads
        .map((upload) => {
          upload.creationTime = new Date(upload.creationTime);
          return upload;
        })
        .filter((upload) => upload.status > limitUpload)
        .sort((a, b) => b.creationTime - a.creationTime);

      // if (previousUploads.length === 0) {
      //   upload.start();
      // }

      // File already exist in the import folder, then return progress as 100

      upload.start();
    }
  }

  /**
   * Checks if an HTTP event is a progress event.
   * @param event - The HTTP event to check.
   * @returns True if the event is a progress event, false otherwise.
   */
  isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
    return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
  }
}
