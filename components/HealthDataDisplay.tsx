/**
 * Composant d'affichage des données de santé
 * Basé sur le tutoriel notJust Development
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHealthDataSimple } from '../hooks/useHealthData';

interface ValueProps {
  label: string;
  value: string;
}

const Value: React.FC<ValueProps> = ({ label, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueLabel}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

interface RingProgressProps {
  progress: number;
}

const RingProgress: React.FC<RingProgressProps> = ({ progress }) => {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
  
  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringBackground}>
        <View style={[styles.ringFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.ringText}>{percentage.toFixed(0)}%</Text>
    </View>
  );
};

const HealthDataDisplay: React.FC = () => {
  const { steps, distance, flights } = useHealthDataSimple();

  console.log(`Steps: ${steps} | Distance: ${distance}m | Flights: ${flights}`);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Données de Santé</Text>
      
      <View style={styles.dataContainer}>
        <Value label="Steps" value={steps.toString()} />
        <Value label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
        <Value label="Flights Climbed" value={flights.toString()} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Objectif Quotidien</Text>
        <RingProgress progress={steps / 10000} />
        <Text style={styles.progressSubtitle}>10,000 pas par jour</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  dataContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  ringBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ringFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 60,
  },
  ringText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HealthDataDisplay;