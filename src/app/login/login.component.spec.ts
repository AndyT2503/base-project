import { ComponentFixture, TestBed } from '@angular/core/testing';

import LoginComponent from './login.component';
import { AuthStore } from '../shared/data-access/store/auth.store';

describe(LoginComponent.name, () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;
  beforeEach(async () => {
    mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [
      'login',
    ]);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: AuthStore,
          useValue: mockedAuthStore
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit when press enter', () => {
    const spySubmit = spyOn(fixture.componentInstance, 'submit');
    fixture.componentInstance.onEnter();
    expect(spySubmit).toHaveBeenCalled();
  });

  it('should login fail when form is invalid', () => {
    fixture.componentInstance.loginForm.setValue({
      password: '',
      username: '',
    });
    fixture.componentInstance.submit();
    expect(mockedAuthStore.login).not.toHaveBeenCalled();
  });

  it('it should invoke authStore.login when form is valid', () => {
    const mockFormValue = {
      password: 'password',
      username: 'username',
    };
    fixture.componentInstance.loginForm.setValue(mockFormValue);
    fixture.componentInstance.submit();
    expect(mockedAuthStore.login).toHaveBeenCalledWith(mockFormValue);
  });
});
