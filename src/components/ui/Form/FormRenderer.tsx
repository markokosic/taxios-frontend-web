import { useTranslation } from 'react-i18next';
import { SimpleGrid, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FormFieldConfig } from '@/common/types/common-types';
import { ControlledSelect } from '../ControlledSelect/ControlledSelect';
import { ControlledTextInput } from '../ControlledTextInput/ControlledTextInput';

type FormRendererProps = {
  formFields: FormFieldGroup[];
};

export type FormFieldGroup = {
  groupName?: string;
  layout: { desktop: { columns: number }; mobile: { columns: number } };
  fields: FieldsGroup[];
};

export interface FieldsGroup extends FormFieldConfig {
  isDisabled?: boolean;
  allowedRoles?: string[]; //add enum later
}

export const FormFieldRenderer = ({ formFields }: FormRendererProps) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const groups = formFields.map((group: FormFieldGroup, index: number) => {
    const columns = isMobile ? group.layout.mobile.columns : group.layout.desktop.columns;
    return (
      <Stack
        key={group.groupName ?? index}
        gap="xs"
        p="xs"
      >
        {group.groupName && (
          <Text
            size="lg"
            c="var(--mantine-primary-color-filled)"
          >
            {t(group.groupName)}
          </Text>
        )}

        <SimpleGrid cols={columns}>
          {group.fields.map((field: FieldsGroup) => {
            switch (field.type) {
              case 'text':
                return (
                  <ControlledTextInput
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    label={t(field.labelKey)}
                    placeholder={t(field.placeholderKey)}
                    readOnly={field?.isDisabled ?? false}
                  />
                );
              case 'select':
                return (
                  <ControlledSelect
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    label={t(field.labelKey)}
                    placeholder={t(field.placeholderKey)}
                    readOnly={field?.isDisabled ?? false}
                  />
                );
              default:
                return null;
            }
          })}
        </SimpleGrid>
      </Stack>
    );
  });

  return <Stack gap="sm">{groups}</Stack>;
};
