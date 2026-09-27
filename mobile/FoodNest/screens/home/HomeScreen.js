import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFoodData } from '../../context/FoodDataContext';
import { useCart } from '../../context/CartContext';
import { colors, spacing, typography } from '../../constants/theme';
import CategoryChip from '../../components/CategoryChip';
import FoodCard from '../../components/FoodCard';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';
import { filterByCategory } from '../../services/foodService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { items, categories, isLoading, error, hasLoadedOnce, load } = useFoodData();
  const { addItem } = useCart();

  useEffect(() => {
    if (!hasLoadedOnce) load();
  }, [hasLoadedOnce, load]);

  const popular = useMemo(() => items.slice(0, 6), [items]);
  const greetingName = user?.name || user?.email?.split('@')[0] || 'there';

  const quickAdd = (item) => {
    const size = item.sizeOptions[0];
    const unitPrice = item.priceBySize[size] || 0;
    if (size) addItem(item, size, 1, unitPrice);
  };

  if (isLoading && !hasLoadedOnce) {
    return <LoadingIndicator label="Loading FoodNest…" />;
  }

  return (
    <FlatList
      style={styles.flex}
      contentContainerStyle={styles.content}
      data={popular}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <View>
          <Text style={styles.greeting}>Hi {greetingName} 👋</Text>
          <Text style={styles.title}>What are you craving today?</Text>

          <Pressable
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchTab')}
            accessibilityRole="button"
            accessibilityLabel="Search FoodNest"
          >
            <Text style={styles.searchPlaceholder}>Search food, category…</Text>
          </Pressable>

          <ErrorBanner message={error} onRetry={load} />

          {categories.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                horizontal
                data={categories}
                keyExtractor={(c) => c}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
                renderItem={({ item: category }) => (
                  <CategoryChip
                    label={category}
                    selected={false}
                    onPress={() =>
                      navigation.navigate('FoodList', {
                        category,
                        items: filterByCategory(items, category),
                      })
                    }
                  />
                )}
              />
            </>
          )}

          {popular.length > 0 && <Text style={styles.sectionTitle}>Popular right now</Text>}
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
        !isLoading && hasLoadedOnce ? (
          <EmptyState
            title="No food available yet"
            subtitle="Check back soon, or pull to refresh."
            actionLabel="Refresh"
            onAction={load}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  columnWrapper: { justifyContent: 'space-between' },
  greeting: { ...typography.caption, color: colors.mutedText },
  title: { ...typography.h1, color: colors.text, marginTop: 2, marginBottom: spacing.md },
  searchBar: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchPlaceholder: { ...typography.body, color: colors.mutedText },
  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  categoryList: { paddingBottom: spacing.lg },
});
