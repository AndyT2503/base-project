import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
  }
}

export const injectDestroyService = inject(DestroyService, { self: true });
