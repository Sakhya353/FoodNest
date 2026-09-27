import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { colors, spacing, typography } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import ErrorBanner from '../../components/ErrorBanner';
import { formatCurrency } from '../../utils/food';
import { validateRequired } from '../../utils/validators';
import { placeOrder } from '../../services/orderService';

export default function CheckoutScreen({ navigation }) {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    const errors = {
      name: validateRequired(name, 'Name'),
      phone: validateRequired(phone, 'Phone number'),
      address: validateRequired(address, 'Delivery address'),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setFormError(null);
    setIsSubmitting(true);
    try {
      const result = await placeOrder({ items, email: user.email });
      if (!result?.success) throw new Error('Order could not be placed.');
      clearCart();
      navigation.replace('OrderConfirmation', { orderDate: result.orderDate, total, itemCount: items.length });
    } catch (err) {
      setFormError(err.friendlyMessage || err.message || 'Could not place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ErrorBanner message={formError} />

        <Text style={styles.sectionTitle}>Customer Information</Text>
        <FormInput label="Full name" value={name} onChangeText={setName} error={fieldErrors.name} />
        <FormInput label="Phone number" value={phone} onChangeText={setPhone} error={fieldErrors.phone} keyboardType="phone-pad" />

        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <FormInput label="Address" value={address} onChangeText={setAddress} error={fieldErrors.address} multiline />
        <Text style={styles.note}>
          Cash on Delivery only — FoodNest does not process online payments.
        </Text>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map((line) => (
          <View key={`${line.id}-${line.size}`} style={styles.summaryRow}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {line.name} × {line.qty} ({line.size})
            </Text>
            <Text style={styles.summaryPrice}>{formatCurrency(line.price)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>

        <PrimaryButton title="Place Order" onPress={handlePlaceOrder} loading={isSubmitting} style={styles.placeOrder} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { ...typography.h2, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  note: { ...typography.small, color: colors.mutedText, marginTop: -spacing.xs, marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryName: { ...typography.caption, color: colors.text, flex: 1, marginRight: spacing.sm },
  summaryPrice: { ...typography.caption, color: colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  totalLabel: { ...typography.h2, color: colors.text },
  totalValue: { ...typography.h1, color: colors.secondary },
  placeOrder: { marginTop: spacing.lg },
});
