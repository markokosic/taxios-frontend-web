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
import i18n from '@/lib/i18n/i18n';
import { getNumberSeparators } from '@/lib/utils';
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

  const { decimalSeparator, thousandSeparator } = getNumberSeparators(i18n.language);

  return (
    <$NumberInput
      {...field}
      {...props}
      ref={ref}
      value={value}
      onChange={(val) => {
        fieldOnChange(val);
      }}
      decimalSeparator={decimalSeparator}
      thousandSeparator={thousandSeparator}
      readOnly={readOnly}
      error={fieldState.error?.message}
      classNames={{
        label: classes.label,
        input: readOnly ? classes.inputReadOnly : undefined,
      }}
    />
  );
};
