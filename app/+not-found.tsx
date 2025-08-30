import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oups !' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n&apos;existe pas.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l&apos;accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
});
