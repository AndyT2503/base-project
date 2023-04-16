import { NzMessageModule } from 'ng-zorro-antd/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet, provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling, TitleStrategy } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { TitleStrategyService } from './layout/services/title-strategy.service';
import { provideAppConfig } from './shared/config/config.di';
import { AppConfig } from './shared/config/config.model';
import { nonAuthGuard, authGuard } from './shared/data-access/guards';
import { apiPrefixInterceptor, bearerTokenInterceptor, removeUndefinedQueryParamsInterceptor, catchErrorInterceptor } from './shared/data-access/interceptors';
import { AuthStore } from './shared/data-access/store/auth.store';

registerLocaleData(en);

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  static bootstrap(config: AppConfig) {
    bootstrapApplication(this, {
      providers: [
        provideRouter(
          [
            {
              path: 'login',
              loadComponent: () => import('./login/login.component'),
              title: 'Sign in',
              canMatch: [nonAuthGuard()],
            },
            {
              path: '',
              loadComponent: () => import('./layout/layout.component'),
              loadChildren: () =>
                import('./layout/layout.routes').then((m) => m.layoutRoutes),
              canMatch: [authGuard()],
            },
          ],
          withPreloading(PreloadAllModules),
          withInMemoryScrolling({
            scrollPositionRestoration: 'top',
          }),
        ),
        importProvidersFrom(BrowserAnimationsModule, NzMessageModule),
        { provide: NZ_I18N, useValue: en_US },
        {
          provide: TitleStrategy,
          useClass: TitleStrategyService,
        },
        provideHttpClient(
          withInterceptors([
            apiPrefixInterceptor,
            bearerTokenInterceptor,
            removeUndefinedQueryParamsInterceptor,
            catchErrorInterceptor,
          ]),
        ),
        provideAppConfig(config),
        provideComponentStore(AuthStore),
      ],
    }).catch((err) => console.error(err));
  }
}
