import { Observable } from 'rxjs';
import * as tus from 'tus-js-client';

import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';
import { ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

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
   * Represents the ongoing TUS upload. It is initialized as null.
   */
  private tusUpload: tus.Upload | null = null;

  /**
   * Constructs an instance of UploadTUSService.
   * @param storage - The LocalStorageService used for storing and retrieving user data.
   * @param cs - The ConfigService for fetching endpoint configurations.
   * @param gs - The GlobalService for handling global functionalities.
   * @param router - The Angular Router service for navigation.
   * @param authService - The AuthService for retrieving the current authentication token.
   */
  constructor(
    protected storage: LocalStorageService<AuthData>,
    private cs: ConfigService,
    private gs: GlobalService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Gets the current authentication token from the AuthService.
   * This method retrieves the token dynamically, ensuring that the latest token is used.
   * @returns The current authentication token, or an empty string if no token is available.
   */
  private getCurrentToken(): string {
    return this.authService.token && true ? this.authService.token : '';
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
      // Get the current authentication token dynamically
      const token = this.getCurrentToken();

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
          Authorization: `Bearer ${token}`,
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
          const errorMessage = String(error).toLowerCase();
          const exist = errorMessage.includes('already exists') || errorMessage.includes('exists!');
          if (exist) {
            const progress = 100;
            observer.next(progress);
            if (form !== null) {
              this.gs.create(serviceConfig, form).subscribe(() => {
                this.router.navigate(redirect);
              });
            }
            observer.complete();
          } else {
            window.alert(`Failed because: ${error}`);
            observer.error(error);
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
      // Look for previous uploads of the same file
      const previousUploads = await upload.findPreviousUploads();

      // Only consider recent uploads within the last 3 hours
      const limitUpload = Date.now() - 3 * 60 * 60 * 1000;
      const recentUploads = previousUploads
        .map((pu) => {
          pu.creationTime = new Date(pu.creationTime);
          return pu;
        })
        .filter((pu) => pu.creationTime.getTime() > limitUpload)
        .sort((a, b) => b.creationTime - a.creationTime);

      // If we have a recent previous upload, attempt to resume from it
      if (recentUploads.length > 0) {
        try {
          upload.resumeFromPreviousUpload(recentUploads[0]);
        } catch {
          // If resume fails, we will start a new upload below
        }
      }

      // Start or continue the upload
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
