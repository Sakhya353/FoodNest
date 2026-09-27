import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.wrapper} accessibilityRole="text">
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.h2, color: colors.text, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
