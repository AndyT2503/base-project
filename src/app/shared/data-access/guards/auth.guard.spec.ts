import { Component, EnvironmentInjector } from '@angular/core';
import {
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { Route, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, ReplaySubject } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-dummy-home',
  template: 'home',
})
class DummyHomeComponent {}

@Component({
  selector: 'app-dummy-target',
  template: 'target',
})
class DummyTargetComponent {}

describe(authGuard.name, () => {
  let isAuthenticated$ = new ReplaySubject<boolean>(1);
  let mockedAuthStore = jasmine.createSpyObj<AuthStore>(
    AuthStore.name,
    [],
    {
      isAuthenticated$,
    }
  );
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyHomeComponent, DummyTargetComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: DummyHomeComponent,
            pathMatch: 'full',
          },
          {
            path: 'target',
            canMatch: [authGuard()],
            component: DummyTargetComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: AuthStore,
          useValue: mockedAuthStore,
        },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('should return urlTree and deny navigate to target when unauthorize', fakeAsync(() => {
    isAuthenticated$.next(false);
    router.navigate(['/target']);
    tick();
    const injector = TestBed.inject(EnvironmentInjector);
    const guardFn = authGuard();
    const canMatch$ = injector.runInContext(() => guardFn({} as Route, [])) as Observable<boolean | UrlTree>;
    canMatch$.subscribe((res) => {
      expect(res).toEqual(router.createUrlTree(['login']));
    });
    expect(router.url).toEqual('/login');
  }));

  it('should return true and navigate to target when authorize', fakeAsync(() => {
    isAuthenticated$.next(true);
    router.navigateByUrl('/target');
    tick();
    const injector = TestBed.inject(EnvironmentInjector);
    const guardFn = authGuard();
    const canMatch$ = injector.runInContext(() => guardFn({} as Route, [])) as Observable<boolean | UrlTree>;
    canMatch$.subscribe((res) => {
      expect(res).toEqual(true);
    });
    expect(router.url).toEqual('/target');
  }));
});
