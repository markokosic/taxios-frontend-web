import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import {
  PasswordInput as $PasswordInput,
  type PasswordInputProps as $PasswordInputProps,
} from '@mantine/core';

type ControlledPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<$PasswordInputProps, 'value' | 'defaultValue' | 'name' | 'onBlur' | 'onChange'>;

export const ControlledPasswordInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  readOnly,
  labelKey,
  placeholderKey,
  ...props
}: ControlledPasswordInputProps<TFieldValues, TName> & { labelKey?: string; placeholderKey?: string }) => {
  const { control: contextControl } = useFormContext<TFieldValues>();


  const {
    field: { value, onChange: fieldOnChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
  });

  return (
    <$PasswordInput
      {...field}
      {...props}
      ref={ref}
      value={value ?? ''}
      onChange={(e) => {
        fieldOnChange(e);
      }}
      readOnly={readOnly}
      error={fieldState.error?.message}
    />
  );
};
