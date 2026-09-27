import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of FoodNest?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.flex}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{(user?.name || user?.email || '?')[0]?.toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.name || 'FoodNest member'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.actions}>
        <PrimaryButton title="My Orders" variant="outline" onPress={() => navigation.navigate('OrdersTab')} style={styles.actionButton} />
        <PrimaryButton title="Log Out" onPress={confirmLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, alignItems: 'center' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  avatarInitial: { ...typography.display, color: colors.white },
  name: { ...typography.h1, color: colors.text, marginTop: spacing.md },
  email: { ...typography.body, color: colors.mutedText, marginTop: spacing.xs },
  actions: { width: '100%', marginTop: spacing.xxl },
  actionButton: { marginBottom: spacing.sm },
});
