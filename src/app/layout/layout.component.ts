import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { MENU_DATA } from '../shared/const';
import { AuthStore } from '../shared/data-access/store/auth.store';
import { HeaderTitleService } from './services/header-title.service';

const nzModules = [
  NzLayoutModule,
  NzDropDownModule,
  NzIconModule,
  NzAvatarModule,
  NzToolTipModule,
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, nzModules, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LayoutComponent {

  isCollapsed = false;
  private readonly authStore = inject(AuthStore);
  private readonly headerTitleService = inject(HeaderTitleService);
  readonly menuList = MENU_DATA;

  routeTitle$ = this.headerTitleService.currentTitle;

  username$ = this.authStore.username$;

  logout(): void {
    this.authStore.logout();
  }

}
