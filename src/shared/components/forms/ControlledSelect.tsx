import React from 'react';
import { Select, SelectProps } from '@mantine/core';
import { useController, useFormContext, FieldValues, Path, UseControllerProps } from 'react-hook-form';

export type FormSelectProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  rules?: UseControllerProps<TFieldValues>['rules'];
  defaultValue?: UseControllerProps<TFieldValues>['defaultValue'];
  isNumber?: boolean;
} & Omit<SelectProps<any>, 'value' | 'onChange' | 'error' | 'name'>;

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  rules,
  defaultValue,
  isNumber = false,
  searchable = true,
  clearable = true,
  data,
  ...selectProps
}: FormSelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <Select
      {...selectProps}
      ref={ref}
      name={name}
      data={data}
      value={value !== null && value !== undefined && value !== '' ? String(value) : null}
      onChange={(val) => {
        if (val === null || val === undefined || val === '') {
          onChange(null);
        } else if (isNumber) {
          const num = Number(val);
          onChange(isNaN(num) ? val : num);
        } else {
          onChange(val);
        }
      }}
      onBlur={onBlur}
      error={error?.message}
      searchable={searchable}
      clearable={clearable}
    />
  );
}