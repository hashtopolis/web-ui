// src/app/core/_services/reload.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  reloadPage(): void {
    window.location.reload();
  }
}
