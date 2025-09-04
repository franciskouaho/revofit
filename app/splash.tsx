import { SubtitleText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function SplashScreen() {
    const { user, loading } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) {
                if (user) {
                    // Utilisateur connecté, rediriger vers l'app principale
                    router.replace('/(tabs)');
                } else {
                    // Utilisateur non connecté, rediriger vers l'onboarding
                    router.replace('/onboarding');
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [user, loading]);

    return (
        <View style={{flex: 1}}>
            <LinearGradient
                colors={['#2a2a00', '#000000', '#000000', '#2a2a00']}
                locations={[0, 0.2, 0.8, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 40}}>
                    <Image
                        source={require('../assets/images/splash-icon.png')}
                        style={{width: 64, height: 64, marginRight: 16}}
                        resizeMode="contain"
                    />

                    <SubtitleText color="#FFFFFF">
                        RevoFit
                    </SubtitleText>
                </View>

                {loading && (
                    <ActivityIndicator size="large" color="#FFD700" />
                )}
            </LinearGradient>
        </View>
    );
}