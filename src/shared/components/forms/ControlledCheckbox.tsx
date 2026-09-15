import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { Checkbox as $Checkbox, type CheckboxProps as $CheckboxProps } from '@mantine/core';

type ControlledCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<$CheckboxProps, 'value' | 'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'checked'>;

export const ControlledCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  ...props
}: ControlledCheckboxProps<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
  });

  return (
    <$Checkbox
      {...field}
      {...props}
      ref={ref}
      checked={!!value}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
      error={fieldState.error?.message}
    />
  );
};
