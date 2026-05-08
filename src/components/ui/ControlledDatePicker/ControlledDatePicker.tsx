import { useState } from 'react';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';
import { DatePicker as $DatePicker, DatePickerProps as $DatePickerProps } from '@mantine/dates';

type ControlledDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<$DatePickerProps, 'value' | 'defaultValue' | 'name' | 'onBlur' | 'onChange'>;

export const ControlledDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  ...props
}: ControlledDatePickerProps<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange: fieldOnChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: contextControl,
  });

  console.log(value);

  // console.log(date);

  return (
    <$DatePicker
      {...field}
      {...props}
      value={value}
      onChange={(e) => {
        fieldOnChange(e);
      }}
    />
  );
};
