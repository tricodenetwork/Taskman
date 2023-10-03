export * from 'react-native';

export const NativeEventEmitter = jest.fn();
// Add other mocks as necessary

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  return {
    ...rn,
    NativeModules: {
      ...rn.NativeModules,
      UIManager: {
        ...rn.NativeModules.UIManager,
        RCTView: () => ({
          directEventTypes: {},
        }),
      },
      RNGestureHandlerModule: {
        State: {},
      },
      PlatformConstants: {
        forceTouchAvailable: false,
      },
    },
    Appearance: {
      getColorScheme: jest.fn(),
      addChangeListener: jest.fn(),
      removeChangeListener: jest.fn(),
    },
  };
});
