const { withGradleProperties } = require('@expo/config-plugins');

const withCustomProguard = (config) => {
  return withGradleProperties(config, (config) => {
    config.modResults = {
      ...config.modResults,
      'android.enableProguardInReleaseBuilds': true,
    };
    return config;
  });
};

module.exports = withCustomProguard;