import { useMemo } from 'react';
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  InputBase,
  useCombobox,
  type InputBaseProps,
} from '@mantine/core';

export type ComboboxOption<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type ControlledComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
> = UseControllerProps<TFieldValues, TName> &
  Omit<InputBaseProps, 'value' | 'defaultValue' | 'onChange'> & {
    data: ComboboxOption<TValue>[];
    placeholder?: string;
    label?: string;
    description?: string;
    error?: string;
  };

export const ControlledCombobox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  data,
  label,
  placeholder,
  description,
  disabled,
  ...props
}: ControlledComboboxProps<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>();

  const {
    field: { value, onChange, ref },
    fieldState,
  } = useController({
    name,
    control: control ?? contextControl,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // We use a mapping to handle non-string values (numbers, objects)
  // The key for the internal Mantine storage will be a stringified version or index
  const optionsMap = useMemo(() => {
    return new Map(data.map((item) => [String(item.value), item]));
  }, [data]);

  const selectedOption = data.find((item) => item.value === value);

  const options = data.map((item) => (
    <Combobox.Option
      value={String(item.value)}
      key={String(item.value)}
      disabled={item.disabled}
    >
      <Group gap="sm">
        {item.value === value && <CheckIcon size={12} />}
        <span>{item.label}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        const originalItem = optionsMap.get(val);
        if (originalItem) {
          onChange(originalItem.value);
        }
        combobox.closeDropdown();
      }}
      disabled={disabled}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          label={label}
          description={description}
          ref={ref}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          error={fieldState.error?.message}
          disabled={disabled}
          {...props}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
