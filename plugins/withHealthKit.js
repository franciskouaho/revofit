const { withInfoPlist } = require('@expo/config-plugins');

/**
 * Plugin Expo pour configurer HealthKit
 * Ajoute les permissions nécessaires pour HealthKit dans Info.plist
 */
const withHealthKit = (config) => {
  return withInfoPlist(config, (config) => {
    // Ajouter les permissions HealthKit
    config.modResults.NSHealthShareUsageDescription =
      config.modResults.NSHealthShareUsageDescription ||
      "RevoFit utilise vos données de santé pour suivre vos progrès et vous motiver.";

    config.modResults.NSHealthUpdateUsageDescription =
      config.modResults.NSHealthUpdateUsageDescription ||
      "RevoFit peut enregistrer vos données d'entraînement dans l'app Santé.";

    // Activer la capability HealthKit
    if (!config.modResults.UIRequiredDeviceCapabilities) {
      config.modResults.UIRequiredDeviceCapabilities = [];
    }

    // S'assurer que HealthKit est dans les capabilities
    config.modResults.UIRequiredDeviceCapabilities.push('healthkit');

    return config;
  });
};

module.exports = withHealthKit;
