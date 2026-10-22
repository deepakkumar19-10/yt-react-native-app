/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

// Suppress known upstream third-party deprecation warning (triggered internally by nativewind / react-native-css-interop)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ImageBackground is deprecated')
  ) {
    return;
  }
  originalWarn(...args);
};

LogBox.ignoreLogs(['ImageBackground is deprecated']);

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

