import { Injectable, signal } from '@angular/core';

/**
 * Tiny shared state for orchestrating intro animations.
 * `ready` flips to true the moment the intro loader lifts, so the hero
 * (and any above-the-fold entrance) plays in sync with the curtain reveal
 * instead of running hidden underneath it.
 */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  readonly ready = signal(false);
}
