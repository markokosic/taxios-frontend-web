import {
  Button,
  Combobox,
  createTheme,
  InputBase,
  MantineColorsTuple,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';

const myColor: MantineColorsTuple = [
  '#e4fdfc',
  '#d7f4f3',
  '#b4e5e4',
  '#95d9d8',
  '#6dcac8',
  '#58c2c0',
  '#4abebc',
  '#38a7a6',
  '#289594',
  '#018281',
];

export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
  // primaryShade: 6,
  defaultRadius: 'md',
  components: {
    // AppShell: {
    //   styles: {
    //     main: {
    //       backgroundColor: '#f4f6f8',
    //     },
    //   },
    // },
    Button: Button.extend({
      defaultProps: {
        variant: 'filled',
        size: 'md',
        radius: 'xl',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 150ms ease',
          '&:active': { transform: 'scale(0.96)' },
        },
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    DatePickerInput: DatePickerInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Combobox: Combobox.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    InputBase: InputBase.extend({
      defaultProps: {
        size: 'md',
      },
    }),
  },

  shadows: {
    xs: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
    sm: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    md: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
  },
});
