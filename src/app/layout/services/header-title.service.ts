import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {
  private readonly currentTitle$ = new BehaviorSubject<string>('');

  get currentTitle() {
    return this.currentTitle$.asObservable();
  }

  setCurrentTitle(value: string) {
    this.currentTitle$.next(value);
  }
}
