import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import { colors, radius, spacing, typography } from '../../constants/theme';
import CategoryChip from '../../components/CategoryChip';
import PrimaryButton from '../../components/PrimaryButton';
import { formatCurrency } from '../../utils/food';

const FALLBACK_IMAGE = 'https://placehold.co/600x400/FBF8F5/7A7069?text=FoodNest';

export default function FoodDetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const { addItem } = useCart();
  const [size, setSize] = useState(item.sizeOptions[0] ?? null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = size ? item.priceBySize[size] : 0;
  const total = unitPrice * qty;

  const decreaseQty = () => setQty((q) => Math.max(1, q - 1));
  const increaseQty = () => setQty((q) => Math.min(20, q + 1));

  const handleAddToCart = () => {
    if (!size) return;
    addItem(item, size, qty, unitPrice);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: item.image?.startsWith('http') ? item.image : FALLBACK_IMAGE }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={item.name}
      />
      <Text style={styles.category}>{item.categoryName}</Text>
      <Text style={styles.name}>{item.name}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

      {item.sizeOptions.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.sizeRow}>
            {item.sizeOptions.map((opt) => (
              <CategoryChip key={opt} label={`${opt} (${formatCurrency(item.priceBySize[opt])})`} selected={size === opt} onPress={() => setSize(opt)} />
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionLabel}>Quantity</Text>
      <View style={styles.qtyRow}>
        <PrimaryButton title="–" variant="outline" onPress={decreaseQty} style={styles.qtyButton} />
        <Text style={styles.qtyValue}>{qty}</Text>
        <PrimaryButton title="+" variant="outline" onPress={increaseQty} style={styles.qtyButton} />
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      <PrimaryButton
        title={justAdded ? 'Added ✓' : 'Add to Cart'}
        onPress={handleAddToCart}
        disabled={!size}
        style={styles.addButton}
      />
      <PrimaryButton title="Go to Cart" variant="outline" onPress={() => navigation.navigate('CartTab')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  image: { width: '100%', height: 220, borderRadius: radius.md, backgroundColor: colors.border },
  category: { ...typography.small, color: colors.mutedText, textTransform: 'uppercase', marginTop: spacing.md },
  name: { ...typography.display, color: colors.text, marginTop: 2 },
  description: { ...typography.body, color: colors.mutedText, marginTop: spacing.sm },
  sectionLabel: { ...typography.h2, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 50, paddingHorizontal: 0 },
  qtyValue: { ...typography.h1, color: colors.text, marginHorizontal: spacing.lg },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  totalLabel: { ...typography.body, color: colors.mutedText },
  totalValue: { ...typography.h1, color: colors.secondary },
  addButton: { marginBottom: spacing.sm },
});
