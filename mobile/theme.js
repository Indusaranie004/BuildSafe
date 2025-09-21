// theme.js
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',      // Green for success
    accent: '#FF9800',       // Orange for alerts
    background: '#F5F5F5',   // App background
    surface: '#FFFFFF',      // Cards and forms
    error: '#F44336',        // Red for errors
    text: '#212121',         // Main text
  },
  roundness: 10,
};
