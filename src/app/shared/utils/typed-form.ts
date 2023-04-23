import {
  FormArray,
  FormControl,
  FormGroup
} from '@angular/forms';

type NgForm = FormArray | FormGroup | FormControl;

export type TypedFormGroup<
  TFormData extends object,
  TOmit = object,
> = TOmit extends Partial<Record<keyof TFormData, NgForm>>
  ? FormGroup<{
      [TFormKey in keyof TFormData]: TOmit[TFormKey] extends NgForm
        ? TOmit[TFormKey]
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
