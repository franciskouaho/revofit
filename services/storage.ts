// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string;
  exercises: string[];
  createdAt: Date;
  coverImage?: string;
}

const STORAGE_KEYS = {
  WORKOUT_TEMPLATES: '@workout_templates',
  HEALTHKIT_CONNECTION: '@healthkit_connection',
} as const;

export class StorageService {
  // Sauvegarder un template d'entraînement
  static async saveWorkoutTemplate(template: Omit<WorkoutTemplate, 'id' | 'createdAt'>): Promise<WorkoutTemplate> {
    try {
      const newTemplate: WorkoutTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      const existingTemplates = await this.getWorkoutTemplates();
      const updatedTemplates = [...existingTemplates, newTemplate];
      
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(updatedTemplates));
      return newTemplate;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error);
      throw error;
    }
  }

  // Récupérer tous les templates d'entraînement
  static async getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
      if (!data) return [];
      
      const templates = JSON.parse(data);
      return templates.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      return [];
    }
  }

  // Supprimer un template d'entraînement
  static async deleteWorkoutTemplate(templateId: string): Promise<void> {
    try {
      const existingTemplates = await this.getWorkoutTemplates();
      const updatedTemplates = existingTemplates.filter(template => template.id !== templateId);
      
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      throw error;
    }
  }

  // Mettre à jour un template d'entraînement
  static async updateWorkoutTemplate(templateId: string, updates: Partial<WorkoutTemplate>): Promise<void> {
    try {
      const existingTemplates = await this.getWorkoutTemplates();
      const updatedTemplates = existingTemplates.map(template => 
        template.id === templateId ? { ...template, ...updates } : template
      );
      
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(updatedTemplates));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du template:', error);
      throw error;
    }
  }

  // Sauvegarder l'état de connexion HealthKit
  static async saveHealthKitConnection(isConnected: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HEALTHKIT_CONNECTION, JSON.stringify({
        isConnected,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la connexion HealthKit:', error);
      throw error;
    }
  }

  // Récupérer l'état de connexion HealthKit
  static async getHealthKitConnection(): Promise<{ isConnected: boolean; timestamp: string } | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HEALTHKIT_CONNECTION);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la connexion HealthKit:', error);
      return null;
    }
  }

  // Supprimer l'état de connexion HealthKit
  static async clearHealthKitConnection(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HEALTHKIT_CONNECTION);
    } catch (error) {
      console.error('Erreur lors de la suppression de la connexion HealthKit:', error);
      throw error;
    }
  }
}
