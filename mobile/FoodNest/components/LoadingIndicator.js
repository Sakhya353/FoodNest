import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export default function LoadingIndicator({ label, fullScreen = true }) {
  return (
    <View style={[styles.wrapper, fullScreen && styles.fullScreen]} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  fullScreen: { flex: 1, backgroundColor: colors.background },
  label: { ...typography.body, color: colors.mutedText, marginTop: spacing.sm },
});
