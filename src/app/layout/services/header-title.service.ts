import { Injectable, signal } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {
  private readonly _currentTitle = signal('');

  get currentTitle() {
    return this._currentTitle.asReadonly();
  }

  setCurrentTitle(value: string) {
    this._currentTitle.set(value);
  }
}
