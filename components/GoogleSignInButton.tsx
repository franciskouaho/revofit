import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  style?: any;
  textStyle?: any;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  style,
  textStyle
}) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onSuccess?.(null); // Le contexte gère déjà l'utilisateur
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de connexion Google';
      onError?.(errorMessage);
      Alert.alert('Erreur', errorMessage);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.googleButton, style]}
      onPress={handleGoogleSignIn}
      activeOpacity={0.8}
    >
      <Text style={[styles.googleButtonText, textStyle]}>
        Se connecter avec Google
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoogleSignInButton;
