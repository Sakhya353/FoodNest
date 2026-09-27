import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import { formatCurrency } from '../../utils/food';

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderDate, total, itemCount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.title}>Order placed!</Text>
      <Text style={styles.subtitle}>Thanks — FoodNest has received your order.</Text>

      <View style={styles.card}>
        <Row label="Date" value={orderDate} />
        <Row label="Items" value={String(itemCount)} />
        <Row label="Total" value={formatCurrency(total)} />
      </View>

      <PrimaryButton title="View My Orders" onPress={() => navigation.navigate('OrdersTab')} style={styles.button} />
      <PrimaryButton title="Back to Home" variant="outline" onPress={() => navigation.navigate('HomeTab')} />
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  check: { fontSize: 48, color: colors.success, textAlign: 'center' },
  title: { ...typography.display, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.mutedText, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.body, color: colors.mutedText },
  rowValue: { ...typography.bodyStrong, color: colors.text },
  button: { marginBottom: spacing.sm },
});
