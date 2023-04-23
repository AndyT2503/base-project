import {
  FormArray,
  FormControl,
  FormGroup
} from '@angular/forms';

type NgForm = FormArray | FormGroup | FormControl;

export type TypedFormGroup<
  TFormData extends object,
  TException = object,
> = TException extends Partial<Record<keyof TFormData, NgForm>>
  ? FormGroup<{
      [TFormKey in keyof TFormData]: TException[TFormKey] extends NgForm
        ? TException[TFormKey]
        : TFormData[TFormKey] extends Date
        ? FormControl<Date>
        : TFormData[TFormKey] extends Array<infer TItem>
        ? TItem extends Date
          ? FormControl<Date[]>
          : TItem extends object
          ? FormArray<TypedFormGroup<TItem>>
          : FormControl<TItem[]>
        : TFormData[TFormKey] extends object
        ? TypedFormGroup<TFormData[TFormKey]>
        : FormControl<TFormData[TFormKey]>;
    }>
  : FormGroup<{
      [TFormKey in keyof TFormData]: TFormData[TFormKey] extends Date
        ? FormControl<Date>
        : TFormData[TFormKey] extends Array<infer TItem>
        ? TItem extends Date
          ? FormControl<Date[]>
          : TItem extends object
          ? FormArray<TypedFormGroup<TItem>>
          : FormControl<TItem[]>
        : TFormData[TFormKey] extends object
        ? TypedFormGroup<TFormData[TFormKey]>
        : FormControl<TFormData[TFormKey]>;
    }>;
