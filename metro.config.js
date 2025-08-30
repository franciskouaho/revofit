const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  // Activer le support CSS pour TailwindCSS
  isCSSEnabled: true,
});

module.exports = config; 