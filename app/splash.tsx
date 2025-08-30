import { SubtitleText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StatusBar, View } from 'react-native';

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{flex: 1}}>
            <StatusBar barStyle="light-content" backgroundColor="#000000"/>

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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        source={require('../assets/images/splash-icon.png')}
                        style={{width: 64, height: 64, marginRight: 16}}
                        resizeMode="contain"
                    />

                    <SubtitleText color="#FFFFFF">
                        RevoFit
                    </SubtitleText>
                </View>
            </LinearGradient>
        </View>
    );
}
