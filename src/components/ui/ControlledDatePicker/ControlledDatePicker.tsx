import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { DatePickerInput, type DatePickerInputProps } from '@mantine/dates';

type ControlledDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<DatePickerInputProps, 'value' | 'defaultValue' | 'onBlur' | 'onChange'>;

export const ControlledDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  ...props
}: ControlledDatePicker<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
    rules,
  });

  return (
    <DatePickerInput
      {...field}
      {...props}
      ref={ref}
      value={value}
      onChange={onChange}
      error={fieldState.error?.message}
    />
  );
};
