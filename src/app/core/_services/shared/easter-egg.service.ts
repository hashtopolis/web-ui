import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription, fromEvent } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  private konamiCode: string[] = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ];
  private currentSequence: string[] = [];
  private konamiDetected$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private keySubscription: Subscription;

  constructor() {
    // Start listening for keyboard events
    this.keySubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleKeypress(event));
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when service is destroyed
    this.destroy$.next();
    this.destroy$.complete();
    this.konamiDetected$.complete();
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }

  // Public method to subscribe to Konami code detection
  onKonamiCodeDetected() {
    return this.konamiDetected$.asObservable();
  }

  private handleKeypress(event: KeyboardEvent): void {
    // Add the key to the sequence
    const key = event.key.toLowerCase();

    // Update the current sequence
    this.currentSequence.push(key);

    // Trim the sequence if it gets too long
    if (this.currentSequence.length > this.konamiCode.length) {
      this.currentSequence.shift();
    }

    // Check if the current sequence matches the Konami code
    if (this.checkKonamiCode()) {
      this.konamiDetected$.next();
      this.currentSequence = []; // Reset after detection
    }
  }

  private checkKonamiCode(): boolean {
    if (this.currentSequence.length !== this.konamiCode.length) {
      return false;
    }

    return this.currentSequence.every((key, index) => key.toLowerCase() === this.konamiCode[index].toLowerCase());
  }
}
