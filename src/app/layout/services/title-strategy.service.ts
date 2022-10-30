import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { HeaderTitleService } from './header-title.service';

@Injectable()
export class TitleStrategyService extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly headerTitleService = inject(HeaderTitleService);
  updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.titleService.setTitle(title);
      this.headerTitleService.setCurrentTitle(title);
    }
  }
}
