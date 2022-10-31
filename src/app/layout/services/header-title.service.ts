import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {
  private readonly currentTitle$ = new ReplaySubject<string>(1);

  get currentTitle() {
    return this.currentTitle$.asObservable();
  }

  setCurrentTitle(value: string) {
    this.currentTitle$.next(value);
  }
}
