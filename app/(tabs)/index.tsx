import { BodyText, SectionText, TitleText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TitleText color="#FFD700">RevoFit</TitleText>
        <BodyText color="#FFFFFF" style={styles.subtitle}>
          Your Fitness Journey Starts Here
        </BodyText>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <SectionText color="#FFFFFF" style={styles.welcomeTitle}>
            Welcome to RevoFit!
          </SectionText>
          <BodyText color="#B0B0B0" style={styles.welcomeText}>
            Your personalized fitness journey starts here. Track workouts, monitor nutrition, and get real-time coaching.
          </BodyText>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <BodyText color="#000000" style={styles.actionButtonText}>
              Start Workout
            </BodyText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <BodyText color="#000000" style={styles.actionButtonText}>
              Track Nutrition
            </BodyText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <BodyText color="#000000" style={styles.actionButtonText}>
              Chat with Coach
            </BodyText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeCard: {
    backgroundColor: '#2A2A2A',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  welcomeTitle: {
    marginBottom: 16,
  },
  welcomeText: {
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: 'bold',
  },
});
