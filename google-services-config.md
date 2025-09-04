# Configuration Google Sign-In pour RevoFit

## 🔧 Configuration Firebase Console

### 1. Activer Google Sign-In dans Firebase
1. Aller dans Firebase Console > Authentication > Sign-in method
2. Activer "Google" comme fournisseur
3. Configurer les domaines autorisés

### 2. Obtenir les identifiants Google
1. Aller dans Google Cloud Console
2. Sélectionner le projet Firebase
3. Aller dans "APIs & Services" > "Credentials"
4. Créer des identifiants OAuth 2.0

### 3. Identifiants nécessaires

#### Web Client ID
- Utilisé pour l'authentification Firebase
- Format: `xxxxx-xxxxx.apps.googleusercontent.com`

#### iOS Client ID (optionnel)
- Pour l'authentification iOS native
- Format: `xxxxx-xxxxx.apps.googleusercontent.com`

#### Android Client ID (optionnel)
- Pour l'authentification Android native
- Format: `xxxxx-xxxxx.apps.googleusercontent.com`

## 📱 Configuration des fichiers

### 1. Variables d'environnement
Créer un fichier `.env` avec :
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
```

### 2. Configuration iOS
Ajouter dans `ios/RevoFit/Info.plist` :
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>REVERSED_CLIENT_ID</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

### 3. Configuration Android
Ajouter dans `android/app/build.gradle` :
```gradle
android {
    defaultConfig {
        resValue "string", "google_web_client_id", "YOUR_WEB_CLIENT_ID"
    }
}
```

## 🚀 Test de la configuration

### 1. Vérifier la configuration
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Vérifier la configuration
const isConfigured = GoogleSignin.isSignedIn();
console.log('Google Sign-In configuré:', isConfigured);
```

### 2. Tester la connexion
```typescript
import { signInWithGoogle } from '@/services/firebase/auth';

try {
  const user = await signInWithGoogle();
  console.log('Utilisateur connecté:', user);
} catch (error) {
  console.error('Erreur de connexion:', error);
}
```

## 🔒 Sécurité

### 1. Règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Validation des tokens
Les tokens Google sont automatiquement validés par Firebase Auth.

## 📝 Notes importantes

1. **Web Client ID** : Obligatoire pour Firebase Auth
2. **iOS/Android Client ID** : Optionnels, améliorent l'expérience utilisateur
3. **Test** : Toujours tester sur un appareil physique
4. **Sécurité** : Ne jamais exposer les clés privées

## 🐛 Dépannage

### Erreur "DEVELOPER_ERROR"
- Vérifier que le package name correspond
- Vérifier la configuration des identifiants

### Erreur "SIGN_IN_CANCELLED"
- L'utilisateur a annulé la connexion
- Gérer gracieusement cette erreur

### Erreur "NETWORK_ERROR"
- Vérifier la connexion internet
- Vérifier la configuration des domaines autorisés
