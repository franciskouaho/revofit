// Composant de bouton de déconnexion
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
  showIcon?: boolean;
}

export default function LogoutButton({ 
  style, 
  textStyle, 
  showIcon = true 
}: LogoutButtonProps) {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#2A2A2A',
          borderRadius: 8,
        },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons 
          name="log-out-outline" 
          size={20} 
          color="#FF6B6B" 
          style={{ marginRight: 8 }} 
        />
      )}
      <Text style={[
        {
          color: '#FF6B6B',
          fontSize: 16,
          fontWeight: '600',
        },
        textStyle,
      ]}>
        Déconnexion
      </Text>
    </TouchableOpacity>
  );
}
