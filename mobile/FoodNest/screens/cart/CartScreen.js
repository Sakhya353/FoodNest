import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import { colors, radius, spacing, typography } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import EmptyState from '../../components/EmptyState';
import { formatCurrency } from '../../utils/food';

const FALLBACK_IMAGE = 'https://placehold.co/120x120/FBF8F5/7A7069?text=%F0%9F%8D%BD';

function CartLine({ line, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.line}>
      <Image
        source={{ uri: line.img?.startsWith('http') ? line.img : FALLBACK_IMAGE }}
        style={styles.lineImage}
        accessibilityLabel={line.name}
      />
      <View style={styles.lineBody}>
        <Text style={styles.lineName} numberOfLines={1}>{line.name}</Text>
        <Text style={styles.lineSize}>{line.size}</Text>
        <View style={styles.qtyRow}>
          <Text onPress={onDecrease} accessibilityRole="button" accessibilityLabel="Decrease quantity" style={styles.qtyButton}>–</Text>
          <Text style={styles.qtyValue}>{line.qty}</Text>
          <Text onPress={onIncrease} accessibilityRole="button" accessibilityLabel="Increase quantity" style={styles.qtyButton}>+</Text>
        </View>
      </View>
      <View style={styles.linePriceCol}>
        <Text style={styles.linePrice}>{formatCurrency(line.price)}</Text>
        <Text onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${line.name}`} style={styles.remove}>
          Remove
        </Text>
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, total, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.flex}>
        <EmptyState
          title="Your cart is empty"
          subtitle="Add something delicious from the menu to get started."
          actionLabel="Browse FoodNest"
          onAction={() => navigation.navigate('HomeTab')}
        />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={(line) => `${line.id}-${line.size}`}
        renderItem={({ item: line }) => (
          <CartLine
            line={line}
            onIncrease={() => setQuantity(line.id, line.size, line.qty + 1)}
            onDecrease={() => setQuantity(line.id, line.size, line.qty - 1)}
            onRemove={() => removeItem(line.id, line.size)}
          />
        )}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <PrimaryButton title="Checkout" onPress={() => navigation.navigate('Checkout')} />
        <PrimaryButton
          title="Continue Shopping"
          variant="outline"
          onPress={() => navigation.navigate('HomeTab')}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  line: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  lineImage: { width: 60, height: 60, borderRadius: radius.sm, backgroundColor: colors.border },
  lineBody: { flex: 1, marginLeft: spacing.sm },
  lineName: { ...typography.bodyStrong, color: colors.text },
  lineSize: { ...typography.small, color: colors.mutedText, textTransform: 'capitalize', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  qtyButton: {
    ...typography.bodyStrong,
    color: colors.primary,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  qtyValue: { ...typography.body, color: colors.text, marginHorizontal: spacing.sm },
  linePriceCol: { alignItems: 'flex-end' },
  linePrice: { ...typography.bodyStrong, color: colors.secondary },
  remove: { ...typography.small, color: colors.error, marginTop: spacing.xs },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  totalLabel: { ...typography.h2, color: colors.text },
  totalValue: { ...typography.h1, color: colors.secondary },
  continueButton: { marginTop: spacing.sm },
});
