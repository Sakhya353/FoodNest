import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFoodData } from '../../context/FoodDataContext';
import { useCart } from '../../context/CartContext';
import { colors, spacing, typography } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import CategoryChip from '../../components/CategoryChip';
import FoodCard from '../../components/FoodCard';
import EmptyState from '../../components/EmptyState';
import LoadingIndicator from '../../components/LoadingIndicator';
import useDebounce from '../../hooks/useDebounce';
import { filterByCategory, searchFood } from '../../services/foodService';

const PRICE_BANDS = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100–₹300', min: 100, max: 300 },
  { label: '₹300+', min: 300, max: Infinity },
];

export default function SearchScreen({ navigation }) {
  const { items, categories, isLoading, hasLoadedOnce, load } = useFoodData();
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [priceBand, setPriceBand] = useState(PRICE_BANDS[0]);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (!hasLoadedOnce) load();
  }, [hasLoadedOnce, load]);

  const results = useMemo(() => {
    let list = searchFood(items, debouncedQuery);
    list = filterByCategory(list, category === 'All' ? null : category);
    list = list.filter((item) => {
      const price = item.startingPrice ?? 0;
      return price >= priceBand.min && price < priceBand.max;
    });
    return list;
  }, [items, debouncedQuery, category, priceBand]);

  const hasActiveFilters = category !== 'All' || priceBand.label !== PRICE_BANDS[0].label || query.trim().length > 0;

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setPriceBand(PRICE_BANDS[0]);
  };

  const quickAdd = (item) => {
    const size = item.sizeOptions[0];
    const unitPrice = item.priceBySize[size] || 0;
    if (size) addItem(item, size, 1, unitPrice);
  };

  if (isLoading && !hasLoadedOnce) {
    return <LoadingIndicator label="Loading menu…" />;
  }

  return (
    <View style={styles.flex}>
      <View style={styles.searchHeader}>
        <FormInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search food, category, description…"
          autoFocus
          accessibilityLabel="Search"
        />
        <FlatList
          horizontal
          data={['All', ...categories]}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip label={item} selected={category === item} onPress={() => setCategory(item)} />
          )}
          style={styles.chipRow}
        />
        <FlatList
          horizontal
          data={PRICE_BANDS}
          keyExtractor={(b) => b.label}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.label}
              selected={priceBand.label === item.label}
              onPress={() => setPriceBand(item)}
            />
          )}
          style={styles.chipRow}
        />
        <View style={styles.resultRow}>
          <Text style={styles.resultCount}>
            {results.length} result{results.length === 1 ? '' : 's'}
          </Text>
          {hasActiveFilters && (
            <Pressable onPress={clearFilters} accessibilityRole="button">
              <Text style={styles.clear}>Clear filters</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onPress={() => navigation.navigate('FoodDetails', { item })}
            onAddToCart={() => quickAdd(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No results"
            subtitle="Try a different search term or clear your filters."
            actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  searchHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, backgroundColor: colors.background },
  chipRow: { marginBottom: spacing.sm },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultCount: { ...typography.caption, color: colors.mutedText },
  clear: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  columnWrapper: { justifyContent: 'space-between' },
});
