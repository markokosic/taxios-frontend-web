import { ReactNode } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Box, ElementProps, Group, PaperProps, Stack } from '@mantine/core';

interface FormProps<T extends FieldValues> extends PaperProps, ElementProps<'form', 'onSubmit'> {
  onSubmit: SubmitHandler<T>;
  children?: ReactNode;
  methods: UseFormReturn<T>;
  id?: string;
  gap?: number | string;
  formActions?: ReactNode;
}

const Form = <T extends FieldValues>({
  children,
  id,
  onSubmit,
  methods,
  gap = 'md',
  formActions,
  ...others
}: FormProps<T>) => {
  return (
    <FormProvider {...methods}>
      <Box
        id={id}
        maw={1020}
        {...others}
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          // eslint-disable-next-line no-console
          console.error(errors);
        })}
        component="form"
      >
        <Stack gap={gap}>{children}</Stack>

        {formActions && (
          <Group
            justify="flex-end"
            mt="lg"
          >
            {formActions}
          </Group>
        )}
      </Box>
    </FormProvider>
  );
};

export { Form };
export { FieldGroup } from './FieldGroup';
