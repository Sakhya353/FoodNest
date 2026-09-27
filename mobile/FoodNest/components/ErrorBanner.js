import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <View style={styles.wrapper} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Retry">
          <Text style={styles.retry}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCEBE8',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  message: { ...typography.caption, color: colors.error, flex: 1, marginRight: spacing.sm },
  retry: { ...typography.caption, color: colors.error, fontWeight: '700', textDecorationLine: 'underline' },
});
