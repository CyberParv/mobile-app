import '@testing-library/jest-native/extend-expect';
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn(), useLocalSearchParams: jest.fn(), Link: 'TouchableOpacity' }));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('react-native-gesture-handler', () => ({}));
global.fetch = jest.fn();
console.warn = jest.fn((...args) => { if (!args[0].includes('NativeWind')) console.error(...args); });