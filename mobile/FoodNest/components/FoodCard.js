import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../constants/theme';
import { formatCurrency } from '../utils/food';

const FALLBACK_IMAGE = 'https://placehold.co/300x220/FBF8F5/7A7069?text=FoodNest';

export default function FoodCard({ item, onPress, onAddToCart }) {
  const priceLabel = item.startingPrice != null ? `From ${formatCurrency(item.startingPrice)}` : 'See options';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.categoryName}, ${priceLabel}`}
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: item.image?.startsWith('http') ? item.image : FALLBACK_IMAGE }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={item.name}
        defaultSource={undefined}
      />
      <View style={styles.body}>
        <Text style={styles.category}>{item.categoryName}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>{priceLabel}</Text>
          <Pressable
            onPress={onAddToCart}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
            style={styles.addButton}
            hitSlop={8}
          >
            <Text style={styles.addButtonLabel}>Add</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.9 },
  image: { width: '100%', height: 110, backgroundColor: colors.border },
  body: { padding: spacing.sm },
  category: { ...typography.small, color: colors.mutedText, textTransform: 'uppercase' },
  name: { ...typography.bodyStrong, color: colors.text, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: { ...typography.caption, color: colors.secondary, fontWeight: '700' },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  addButtonLabel: { ...typography.small, color: colors.white, fontWeight: '700' },
});
