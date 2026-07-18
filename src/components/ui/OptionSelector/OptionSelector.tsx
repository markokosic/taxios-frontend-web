import { Stack, Tabs, Text } from '@mantine/core';

type Option = {
  label: string;
  value: string | number;
};

interface OptionSelectorProps {
  options: Option[];
  title?: string;
  subtitle?: string;
  selectedOption: string | number | null;
  onChange: (value: unknown) => void;
}

export const OptionSelector = ({
  options,
  title,
  subtitle,
  selectedOption,
  onChange,
}: OptionSelectorProps) => {
  return (
    <Stack
      align="center"
      gap="md"
      w="fit-content"
    >
      {title && (
        <Stack
          align="center"
          gap={2}
        >
          {title && (
            <Text
              fw={500}
              size="lg"
              ta="center"
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              ta="center"
              c="dimmed"
              size="sm"
            >
              {subtitle}
            </Text>
          )}
        </Stack>
      )}

      <Tabs
        value={selectedOption?.toString()}
        onChange={(value) => onChange(value)}
        variant="pills"
        styles={(theme) => ({
          root: {
            backgroundColor: theme.colors.gray[0],
            padding: '4px',
            borderRadius: theme.radius.xl,
          },
          // tab: {
          //   '&[dataActive]': {
          //     backgroundColor: 'white',
          //     color: 'black',
          //     boxShadow: theme.shadows.xs,
          //   },
          // },
        })}
      >
        <Tabs.List>
          {options.map((option) => (
            <Tabs.Tab
              key={option.value}
              value={option.value.toString()}
            >
              {option.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Stack>
  );
};
