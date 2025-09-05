import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    registerForPushNotifications,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
  } = useNotifications();

  // Enregistrer pour les notifications push au montage
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout': return 'fitness';
      case 'nutrition': return 'restaurant';
      case 'coach': return 'chatbubble';
      case 'reminder': return 'time';
      case 'achievement': return 'trophy';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'workout': return '#4ECDC4';
      case 'nutrition': return '#FFD700';
      case 'coach': return '#FF6B6B';
      case 'reminder': return '#B388FF';
      case 'achievement': return '#FFA726';
      default: return '#FFD700';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
    return `Il y a ${Math.floor(diffInSeconds / 604800)} semaines`;
  };

  const renderNotification = (notification: any) => {
    const color = getNotificationColor(notification.type);
    const icon = getNotificationIcon(notification.type);
    const timeAgo = formatTimeAgo(notification.createdAt);

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          !notification.isRead && styles.unreadNotification
        ]}
        onPress={() => markAsRead(notification.id)}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.notificationIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={color} 
            />
          </View>
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{timeAgo}</Text>
          </View>
          {!notification.isRead && (
            <View style={styles.unreadIndicator}>
              <View style={[styles.unreadDot, { backgroundColor: color }]} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.clearButton} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={{ color: '#fff', marginTop: 16 }}>Chargement des notifications...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.clearButton} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
            <Text style={{ color: '#fff', marginTop: 16, textAlign: 'center' }}>{error}</Text>
            <TouchableOpacity 
              style={[styles.clearButton, { marginTop: 16 }]} 
              onPress={refreshNotifications}
            >
              <Text style={styles.clearButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fond avec gradient */}
      <LinearGradient
        colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statsGlass}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Non lues</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{notifications.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <>
              <View style={styles.notificationsSection}>
                <Text style={styles.sectionTitle}>Aujourd&apos;hui</Text>
                <View style={styles.notificationsContainer}>
                  {notifications
                    .filter(n => {
                      const today = new Date();
                      const notificationDate = new Date(n.createdAt);
                      return notificationDate.toDateString() === today.toDateString();
                    })
                    .map(renderNotification)}
                </View>
              </View>

              <View style={styles.notificationsSection}>
                <Text style={styles.sectionTitle}>Plus tôt</Text>
                <View style={styles.notificationsContainer}>
                  {notifications
                    .filter(n => {
                      const today = new Date();
                      const notificationDate = new Date(n.createdAt);
                      return notificationDate.toDateString() !== today.toDateString();
                    })
                    .map(renderNotification)}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={64} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyStateTitle}>Aucune notification</Text>
              <Text style={styles.emptyStateMessage}>
                Vous n'avez pas encore de notifications. Elles apparaîtront ici quand vous en recevrez.
              </Text>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  clearButton: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  clearButtonText: { fontSize: 14, color: '#FF6B6B', fontWeight: '600' },
  scrollView: { flex: 1 },
  statsSection: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 30 },
  statsGlass: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 24,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, color: '#FFD700', fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  notificationsSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 16, color: '#FFD700', fontWeight: '700',
    marginBottom: 16, paddingHorizontal: 20,
  },
  notificationsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationItem: { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  unreadNotification: { backgroundColor: 'rgba(255, 215, 0, 0.05)' },
  notificationContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  notificationIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  notificationText: { flex: 1 },
  notificationTitle: { fontSize: 16, color: '#FFFFFF', fontWeight: '600', marginBottom: 4 },
  notificationMessage: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 6, lineHeight: 20 },
  notificationTime: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', fontWeight: '400' },
  unreadIndicator: { marginLeft: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  bottomSpacing: { height: 20 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
