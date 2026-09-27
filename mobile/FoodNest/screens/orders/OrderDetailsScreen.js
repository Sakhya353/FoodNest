import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { formatCurrency } from '../../utils/food';

const FALLBACK_IMAGE = 'https://placehold.co/120x120/FBF8F5/7A7069?text=%F0%9F%8D%BD';

export default function OrderDetailsScreen({ route }) {
  const { order } = route.params;

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.date}>Placed on {order.date}</Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.content}
        data={order.items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              source={{ uri: item.img?.startsWith('http') ? item.img : FALLBACK_IMAGE }}
              style={styles.image}
              accessibilityLabel={item.name}
            />
            <View style={styles.rowBody}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.size} · Qty {item.qty}
              </Text>
            </View>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: { ...typography.body, color: colors.mutedText },
  total: { ...typography.h2, color: colors.secondary },
  content: { padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  image: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: colors.border },
  rowBody: { flex: 1, marginLeft: spacing.sm },
  name: { ...typography.bodyStrong, color: colors.text },
  meta: { ...typography.caption, color: colors.mutedText, textTransform: 'capitalize' },
  price: { ...typography.bodyStrong, color: colors.text },
});
