# Guide de résolution du badge de notification

## Problème
Le badge orange sur l'icône de notification apparaît même quand il n'y a pas de notifications.

## Solution implémentée

### 1. Gestion automatique du badge
Le hook `useNotifications` gère maintenant automatiquement le badge :
- Le badge se met à jour automatiquement quand le nombre de notifications non lues change
- Le badge est effacé quand toutes les notifications sont supprimées
- Le badge est mis à jour quand une notification est marquée comme lue

### 2. Composant NotificationIcon
Un nouveau composant `NotificationIcon` affiche l'icône avec le badge :
```tsx
import { NotificationIcon } from '@/components/NotificationIcon';

<NotificationIcon 
  onPress={() => router.push('/notifications')} 
  size={24} 
  color="#FFFFFF" 
/>
```

### 3. Initialisation des notifications
Le composant `NotificationInitializer` initialise les notifications au démarrage :
```tsx
import { NotificationInitializer } from '@/components/NotificationInitializer';

<NotificationInitializer>
  <YourApp />
</NotificationInitializer>
```

### 4. Gestionnaire de notifications
Le service `notificationManager` fournit des fonctions utilitaires :
```tsx
import { clearNotificationBadge, updateNotificationBadge } from '@/services/notificationManager';

// Effacer le badge
await clearNotificationBadge();

// Mettre à jour le badge
await updateNotificationBadge(5);
```

## Utilisation recommandée

### Dans votre layout principal
```tsx
import { NotificationInitializer } from '@/components/NotificationInitializer';

export default function RootLayout() {
  return (
    <NotificationInitializer>
      <YourAppContent />
    </NotificationInitializer>
  );
}
```

### Dans votre header/navigation
```tsx
import { NotificationIcon } from '@/components/NotificationIcon';

<NotificationIcon onPress={() => router.push('/notifications')} />
```

### Pour forcer la mise à jour du badge
```tsx
import { useNotifications } from '@/hooks/useNotifications';

const { updateBadgeCount, clearBadge } = useNotifications();

// Mettre à jour le badge
await updateBadgeCount();

// Effacer le badge
await clearBadge();
```

## Dépannage

### Le badge ne se met pas à jour
1. Vérifiez que `NotificationInitializer` est utilisé dans votre app
2. Vérifiez que le hook `useNotifications` est utilisé correctement
3. Vérifiez les permissions de notification

### Le badge persiste après suppression des notifications
1. Appelez `clearBadge()` après avoir supprimé les notifications
2. Vérifiez que `unreadCount` est bien mis à jour

### Le badge ne s'affiche pas
1. Vérifiez que `unreadCount > 0`
2. Vérifiez que le composant `NotificationIcon` est utilisé
3. Vérifiez les styles du badge

## Test
Utilisez le composant `NotificationExample` pour tester l'affichage du badge :
```tsx
import { NotificationExample } from '@/examples/NotificationExample';
```
