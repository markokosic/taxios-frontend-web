import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { DateTimePicker, type DateTimePickerProps } from '@mantine/dates';

type ControlledDateTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<DateTimePickerProps, 'value' | 'defaultValue' | 'onBlur' | 'onChange'>;

export const ControlledDateTimePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  ...props
}: ControlledDateTimePickerProps<TFieldValues, TName>) => {
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
    <DateTimePicker
      {...field}
      {...props}
      ref={ref}
      value={value ? new Date(value) : null}
      onChange={onChange}
      valueFormat="DD.MM.YYYY HH:mm"
      error={fieldState.error?.message}
    />
  );
};
