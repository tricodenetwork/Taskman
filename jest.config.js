const config = {
  extensionsToTreatAsEsm: ['.ts',".jsx"],
  setupFilesAfterEnv: ['./jest.setup.js'],
    transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
   moduleFileExtensions: [
      "js",
      "json",
      "jsx",
      "ts",
      "tsx",
      "android.js",
      "android.tsx",
      "ios.js",
      "ios.tsx",
      "node"
    ]
};

module.exports = config;