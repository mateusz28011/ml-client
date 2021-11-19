import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
// import { FormErrorMessageStyle as FormErrorMessage } from './components/FormErrorMessageStyle';

export const customTheme = extendTheme(
  withDefaultColorScheme({ colorScheme: 'orange' }),
  baseTheme
);
