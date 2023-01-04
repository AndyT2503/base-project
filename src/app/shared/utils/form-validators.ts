import { AbstractControl, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static validateRequiredNumber(): ValidatorFn {
    return (control: AbstractControl) => {
      const isValid =
        control.value !== null &&
        control.value !== undefined &&
        !Number.isNaN(control.value);
      return isValid ? null : { required: true };
    };
  }
}
