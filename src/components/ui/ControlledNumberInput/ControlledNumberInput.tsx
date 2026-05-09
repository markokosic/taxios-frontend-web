import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import {
  NumberInput as $NumberInput,
  type NumberInputProps as $NumberInputProps,
} from '@mantine/core';
import classes from '../ControlledTextInput/ControlledTextInput.module.css';

type ControlledNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<$NumberInputProps, 'value' | 'defaultValue' | 'name' | 'onBlur' | 'onChange'>;

export const ControlledNumberInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  control,
  readOnly,
  ...props
}: ControlledNumberInputProps<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange: fieldOnChange, ref, ...field },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
  });

  return (
    <$NumberInput
      {...field}
      {...props}
      ref={ref}
      value={value}
      onChange={(val) => {
        fieldOnChange(val);
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
