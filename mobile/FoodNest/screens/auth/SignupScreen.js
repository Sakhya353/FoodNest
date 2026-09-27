import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import ErrorBanner from '../../components/ErrorBanner';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validateRequired,
} from '../../utils/validators';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const errors = {
      name: validateName(name),
      email: validateEmail(email),
      // The existing User model requires a `location` field on signup.
      location: validateRequired(location, 'Delivery address'),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setFormError(null);
    setIsSubmitting(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password, location: location.trim() });
      setSuccess(true);
    } catch (err) {
      setFormError(err.message || 'Could not create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.subtitle}>Your FoodNest account was created. Log in to start ordering.</Text>
        <PrimaryButton title="Go to Login" onPress={() => navigation.replace('Login')} style={styles.submit} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join FoodNest to discover, order, and enjoy.</Text>

        <ErrorBanner message={formError} />

        <FormInput label="Full name" value={name} onChangeText={setName} error={fieldErrors.name} placeholder="Jane Doe" />
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <FormInput
          label="Delivery address"
          value={location}
          onChangeText={setLocation}
          error={fieldErrors.location}
          placeholder="Street, city"
        />
        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          secureToggle
          placeholder="••••••"
        />
        <FormInput
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          secureToggle
          placeholder="••••••"
        />

        <PrimaryButton title="Sign Up" onPress={handleSubmit} loading={isSubmitting} style={styles.submit} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Login')} accessibilityRole="link">
            Log in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  centered: { alignItems: 'center' },
  title: { ...typography.display, color: colors.text, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.mutedText,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  submit: { marginTop: spacing.sm, alignSelf: 'stretch' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.caption, color: colors.mutedText },
  link: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});
