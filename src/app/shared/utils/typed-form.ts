import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

type StandardTypedForm<TForm> = [TForm] extends [Date]
  ? FormControl<Date>
  : [TForm] extends [Array<infer TItem>]
  ? TItem extends Date
    ? FormControl<Date[]>
    : TItem extends object
    ? FormArray<TypedFormGroup<TItem>>
    : FormControl<TItem[]>
  : [TForm] extends [object]
  ? TypedFormGroup<TForm>
  : FormControl<TForm>;

export type TypedFormGroup<
  TFormData extends object,
  TExceptionForm extends Partial<Record<keyof TFormData, AbstractControl>> = object,
> = TExceptionForm extends Partial<Record<keyof TFormData, AbstractControl>>
  ? FormGroup<{
      [TFormKey in keyof TFormData]: TExceptionForm[TFormKey] extends AbstractControl
        ? TExceptionForm[TFormKey]
        : StandardTypedForm<TFormData[TFormKey]>;
    }>
  : FormGroup<{
      [TFormKey in keyof TFormData]: StandardTypedForm<TFormData[TFormKey]>;
    }>;
