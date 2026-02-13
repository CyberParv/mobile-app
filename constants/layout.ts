import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const layout = {
  screen: {
    width,
    height
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }
} as const;
