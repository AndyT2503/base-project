import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TypedFormGroup } from 'src/app/shared/utils';
import { AuthStore, UserLoginRequest } from '../shared/data-access/store/auth.store';

const nzModules = [
  NzFormModule,
  NzButtonModule,
  NzInputModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, nzModules],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authStore = inject(AuthStore);
  loginForm: TypedFormGroup<UserLoginRequest> = new FormGroup({
    username: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  @HostListener('document:keydown.enter', ['$event'])
  onEnter() {
    this.submit();
  }

  submit(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const { username, password } = this.loginForm.getRawValue();
    this.authStore.login({
      username,
      password,
    });
  }
}
