import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Theme } from '@react-navigation/native';

type CustomTheme = Theme & typeof MD3LightTheme;

const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Navigation theme colors
    card: MD3LightTheme.colors.surface,
    text: MD3LightTheme.colors.onSurface,
    border: MD3LightTheme.colors.outline,
    notification: MD3LightTheme.colors.error,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    // Navigation theme fonts
    regular: {
      fontFamily: MD3LightTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '400',
    },
    medium: {
      fontFamily: MD3LightTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '500',
    },
    bold: {
      fontFamily: MD3LightTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: MD3LightTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '900',
    },
  },
};

const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Navigation theme colors
    card: MD3DarkTheme.colors.surface,
    text: MD3DarkTheme.colors.onSurface,
    border: MD3DarkTheme.colors.outline,
    notification: MD3DarkTheme.colors.error,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    // Navigation theme fonts
    regular: {
      fontFamily: MD3DarkTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '400',
    },
    medium: {
      fontFamily: MD3DarkTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '500',
    },
    bold: {
      fontFamily: MD3DarkTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: MD3DarkTheme.fonts.bodyLarge.fontFamily,
      fontWeight: '900',
    },
  },
};

export { lightTheme, darkTheme }; 