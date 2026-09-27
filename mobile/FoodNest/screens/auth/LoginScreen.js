import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import ErrorBanner from '../../components/ErrorBanner';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setFormError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // RootNavigator reacts to isAuthenticated automatically.
    } catch (err) {
      setFormError(err.friendlyMessage || err.message || 'Could not log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue with FoodNest.</Text>

        <ErrorBanner message={formError} />

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          secureToggle
          placeholder="••••••"
          textContentType="password"
        />

        <PrimaryButton title="Log In" onPress={handleSubmit} loading={isSubmitting} style={styles.submit} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to FoodNest? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')} accessibilityRole="link">
            Create an account
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  title: { ...typography.display, color: colors.text },
  subtitle: { ...typography.body, color: colors.mutedText, marginTop: spacing.xs, marginBottom: spacing.lg },
  submit: { marginTop: spacing.sm },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.caption, color: colors.mutedText },
  link: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});
