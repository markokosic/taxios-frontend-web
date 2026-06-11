import { ReactNode } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { ElementProps, Group, Paper, PaperProps, Stack } from '@mantine/core';
// import { FormFieldGroup, FormFieldRenderer } from './FormRenderer';

interface FormProps<T extends FieldValues> extends PaperProps, ElementProps<'form', 'onSubmit'> {
  onSubmit: SubmitHandler<T>;
  children?: ReactNode;
  methods: UseFormReturn<T>;
  id?: string;
  gap?: number | string;
  // formFields?: FormFieldGroup[];
  formActions?: ReactNode;
}

const Form = <T extends FieldValues>({
  children,
  id,
  onSubmit,
  methods,
  gap = 'md',
  // formFields,
  formActions,
  ...others
}: FormProps<T>) => {
  return (
    <FormProvider {...methods}>
      <Paper
        id={id}
        maw={1020}
        {...others}
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          console.error(errors);
        })}
        component="form"
        p="sm"
      >
        <Stack gap={gap}>{children}</Stack>
        {/* {children && !formFields ? (
        ) : (
          <FormFieldRenderer formFields={formFields} />
        )} */}

        {formActions && (
          <Group
            justify="flex-end"
            mt="lg"
          >
            {formActions}
          </Group>
        )}
      </Paper>
    </FormProvider>
  );
};

export { Form };
