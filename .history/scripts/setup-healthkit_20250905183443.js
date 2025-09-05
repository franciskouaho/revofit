#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏥 Configuration d\'Apple HealthKit pour RevoFit...');

// Chemin vers le fichier project.pbxproj
const projectPath = path.join(__dirname, '../ios/RevoFit.xcodeproj/project.pbxproj');

if (!fs.existsSync(projectPath)) {
  console.error('❌ Fichier project.pbxproj non trouvé. Assurez-vous d\'être dans le bon répertoire.');
  process.exit(1);
}

try {
  let projectContent = fs.readFileSync(projectPath, 'utf8');
  
  // Vérifier si HealthKit est déjà configuré
  if (projectContent.includes('HealthKit')) {
    console.log('✅ HealthKit est déjà configuré dans le projet.');
    return;
  }
  
  // Ajouter HealthKit framework
  const frameworkSection = /(PBXFrameworksBuildPhase section.*?)(\s+isa = PBXBuildFile;)/;
  if (frameworkSection.test(projectContent)) {
    projectContent = projectContent.replace(
      frameworkSection,
      `$1
		/* HealthKit.framework in Frameworks */
		HEALTHKIT_FRAMEWORK = {isa = PBXBuildFile; fileRef = HEALTHKIT_FILE_REF; };
		$2`
    );
  }
  
  // Ajouter la référence du fichier HealthKit
  const fileRefSection = /(PBXFileReference section.*?)(\s+isa = PBXFileReference;)/;
  if (fileRefSection.test(projectContent)) {
    projectContent = projectContent.replace(
      fileRefSection,
      `$1
		HEALTHKIT_FILE_REF = {isa = PBXFileReference; lastKnownFileType = wrapper.framework; name = HealthKit.framework; path = System/Library/Frameworks/HealthKit.framework; sourceTree = SDKROOT; };
		$2`
    );
  }
  
  // Ajouter HealthKit aux frameworks
  const frameworksBuildPhase = /(PBXFrameworksBuildPhase section.*?files = \(.*?)(\s+);\s+runOnlyForDeploymentPostprocessing = 0;)/;
  if (frameworksBuildPhase.test(projectContent)) {
    projectContent = projectContent.replace(
      frameworksBuildPhase,
      `$1
			HEALTHKIT_FRAMEWORK in Frameworks,
		$2`
    );
  }
  
  // Ajouter HealthKit aux capabilities
  const systemCapabilities = /(SystemCapabilities = \{[^}]*\})/;
  if (systemCapabilities.test(projectContent)) {
    projectContent = projectContent.replace(
      systemCapabilities,
      `SystemCapabilities = {
				com.apple.HealthKit = {
					enabled = 1;
				};
			}`
    );
  } else {
    // Ajouter la section SystemCapabilities si elle n'existe pas
    const targetSection = /(buildConfigurationList = [^;]*;.*?buildPhases = \([^)]*\);.*?buildRules = \([^)]*\);.*?dependencies = \([^)]*\);.*?name = [^;]*;.*?productName = [^;]*;)/;
    if (targetSection.test(projectContent)) {
      projectContent = projectContent.replace(
        targetSection,
        `$1
				SystemCapabilities = {
					com.apple.HealthKit = {
						enabled = 1;
					};
				};`
      );
    }
  }
  
  // Écrire le fichier modifié
  fs.writeFileSync(projectPath, projectContent);
  
  console.log('✅ HealthKit configuré avec succès dans le projet Xcode !');
  console.log('📝 Instructions supplémentaires :');
  console.log('   1. Ouvrez le projet dans Xcode : ios/RevoFit.xcworkspace');
  console.log('   2. Sélectionnez le projet RevoFit dans le navigateur');
  console.log('   3. Allez dans l\'onglet "Signing & Capabilities"');
  console.log('   4. Cliquez sur "+ Capability" et ajoutez "HealthKit"');
  console.log('   5. Cochez "Clinical Health Records" si nécessaire');
  console.log('   6. Compilez et testez l\'application');
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration de HealthKit:', error.message);
  console.log('📝 Configuration manuelle requise :');
  console.log('   1. Ouvrez le projet dans Xcode : ios/RevoFit.xcworkspace');
  console.log('   2. Sélectionnez le projet RevoFit dans le navigateur');
  console.log('   3. Allez dans l\'onglet "Signing & Capabilities"');
  console.log('   4. Cliquez sur "+ Capability" et ajoutez "HealthKit"');
  console.log('   5. Cochez "Clinical Health Records" si nécessaire');
  console.log('   6. Compilez et testez l\'application');
}
