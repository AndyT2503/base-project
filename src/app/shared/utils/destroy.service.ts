import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
  }
}

export function injectDestroyService() {
  return inject(DestroyService, { self: true });
}

export function provideDestroyService() {
  return DestroyService;
}
