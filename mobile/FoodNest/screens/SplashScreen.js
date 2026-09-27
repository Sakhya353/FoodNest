import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import LoadingIndicator from '../components/LoadingIndicator';

// Shown while AuthContext restores any persisted session from storage.
// RootNavigator watches `isInitializing` and swaps this out for the
// Auth stack or Main tabs as soon as it resolves.
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.brandBlock}>
        <Text style={styles.title}>FoodNest</Text>
        <Text style={styles.tagline}>Discover. Order. Enjoy.</Text>
      </View>
      <LoadingIndicator fullScreen={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBlock: { alignItems: 'center', marginBottom: spacing.xxl },
  title: { ...typography.display, fontSize: 40, color: colors.white },
  tagline: { ...typography.body, color: colors.white, marginTop: spacing.xs, opacity: 0.9 },
});
