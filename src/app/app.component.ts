import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { Component, importProvidersFrom, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  RouterModule,
  TitleStrategy,
  withInMemoryScrolling,
  withPreloading
} from '@angular/router';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TitleStrategyService } from './layout/services/title-strategy.service';
import { provideAppConfig } from './shared/config/config.di';
import { AppConfig } from './shared/config/config.model';
import { AuthGuard, NonAuthGuard } from './shared/data-access/guards';
import { interceptorProviders } from './shared/data-access/interceptors';
import { AuthStore } from './shared/data-access/store/auth.store';

registerLocaleData(en);

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    this.authStore.init();
  }

  static bootstrap(config: AppConfig) {
    bootstrapApplication(this, {
      providers: [
        provideRouter(
          [
            {
              path: 'login',
              loadComponent: () =>
                import('./login/login.component').then((c) => c.LoginComponent),
              title: 'Sign in',
              canMatch: [NonAuthGuard]
            },
            {
              path: '',
              loadComponent: () =>
                import('./layout/layout.component').then(
                  (c) => c.LayoutComponent
                ),
              loadChildren: () =>
                import('./layout/layout.routes').then((m) => m.layoutRoutes),
              canLoad: [AuthGuard],
              canMatch: [AuthGuard],
            },
          ],
          withPreloading(PreloadAllModules),
          withInMemoryScrolling({
            scrollPositionRestoration: 'top',
          })
        ),
        importProvidersFrom(BrowserAnimationsModule, HttpClientModule, NzMessageModule),
        { provide: NZ_I18N, useValue: en_US },
        {
          provide: TitleStrategy,
          useClass: TitleStrategyService,
        },
        provideAppConfig(config),
        ...interceptorProviders,
      ],
    }).catch((err) => console.error(err));
  }
}
