import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { TextInput as $TextInput, type TextInputProps as $TextInputProps } from '@mantine/core';
import classes from './ControlledTextInput.module.css';

type ControlledTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<$TextInputProps, 'value' | 'defaultValue' | 'name' | 'onBlur' | 'onChange'>;

export const ControlledTextInput = <
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
}: ControlledTextInputProps<TFieldValues, TName> & { labelKey?: string; placeholderKey?: string }) => {
  const { control: contextControl } = useFormContext<TFieldValues>();


  const {
    field: { value, onChange: fieldOnChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
  });

  return (
    <$TextInput
      {...field}
      {...props}
      ref={ref}
      value={value}
      onChange={(e) => {
        fieldOnChange(e);
      }}
      readOnly={readOnly}
      error={fieldState.error?.message}
      classNames={{
        label: classes.label,
        input: readOnly ? classes.inputReadOnly : undefined,
      }}
    />
  );
};
