import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import { colors, spacing, typography } from '../../constants/theme';
import FoodCard from '../../components/FoodCard';
import EmptyState from '../../components/EmptyState';

export default function FoodListScreen({ route, navigation }) {
  const { category, items } = route.params;
  const { addItem } = useCart();

  useLayoutEffect(() => {
    navigation.setOptions({ title: category });
  }, [navigation, category]);

  const quickAdd = (item) => {
    const size = item.sizeOptions[0];
    const unitPrice = item.priceBySize[size] || 0;
    if (size) addItem(item, size, 1, unitPrice);
  };

  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <View>
          <Text style={styles.resultCount}>
            {items.length} item{items.length === 1 ? '' : 's'} in {category}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <FoodCard
          item={item}
          onPress={() => navigation.navigate('FoodDetails', { item })}
          onAddToCart={() => quickAdd(item)}
        />
      )}
      ListEmptyComponent={
        <EmptyState title="No items in this category" subtitle="Try browsing another category from Home." />
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  columnWrapper: { justifyContent: 'space-between' },
  resultCount: { ...typography.caption, color: colors.mutedText, marginBottom: spacing.md },
});
