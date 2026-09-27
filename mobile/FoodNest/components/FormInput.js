import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function FormInput({
  label,
  value,
  onChangeText,
  error,
  secureToggle = false,
  ...textInputProps
}) {
  const [isSecure, setIsSecure] = useState(secureToggle);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureToggle ? isSecure : false}
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          accessibilityLabel={label}
          {...textInputProps}
        />
        {secureToggle && (
          <Pressable
            onPress={() => setIsSecure((s) => !s)}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            hitSlop={10}
          >
            <Text style={styles.toggle}>{isSecure ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.xs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputRowError: { borderColor: colors.error },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
  toggle: { ...typography.small, color: colors.primary, fontWeight: '700', marginLeft: spacing.sm },
  error: { ...typography.small, color: colors.error, marginTop: spacing.xs },
});
