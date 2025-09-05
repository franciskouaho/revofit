const { withInfoPlist } = require('@expo/config-plugins');

const withHealthKit = (config) => {
  return withInfoPlist(config, (config) => {
    // Ajouter les permissions HealthKit
    config.modResults.NSHealthShareUsageDescription = 
      "RevoFit a besoin d'accéder à vos données de santé pour synchroniser vos entraînements et améliorer votre expérience fitness.";
    config.modResults.NSHealthUpdateUsageDescription = 
      "RevoFit souhaite enregistrer vos données d'entraînement dans Apple Health pour un suivi complet de votre activité physique.";
    
    return config;
  });
};

module.exports = withHealthKit;
