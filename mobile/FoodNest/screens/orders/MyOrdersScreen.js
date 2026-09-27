import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, shadow, spacing, typography } from '../../constants/theme';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';
import { formatCurrency } from '../../utils/food';
import { fetchMyOrders } from '../../services/orderService';

export default function MyOrdersScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMyOrders(user.email);
      setOrders(data);
    } catch (err) {
      setError(err.friendlyMessage || 'Could not load your orders.');
    } finally {
      setIsLoading(false);
    }
  }, [user.email]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (isLoading) return <LoadingIndicator label="Loading your orders…" />;

  return (
    <View style={styles.flex}>
      <ErrorBanner message={error} onRetry={load} />
      <FlatList
        contentContainerStyle={styles.content}
        data={orders}
        keyExtractor={(order, index) => `${order.date}-${index}`}
        renderItem={({ item: order, index }) => (
          <Pressable
            style={[styles.card, shadow.card]}
            onPress={() => navigation.navigate('OrderDetails', { order })}
            accessibilityRole="button"
          >
            <View style={styles.cardHeader}>
              <Text style={styles.orderLabel}>Order placed</Text>
              <Text style={styles.date}>{order.date}</Text>
            </View>
            <Text style={styles.itemCount}>
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </Text>
            <Text style={styles.total}>{formatCurrency(order.total)}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !error && (
            <EmptyState
              title="No orders yet"
              subtitle="Your past FoodNest orders will show up here."
              actionLabel="Browse FoodNest"
              onAction={() => navigation.navigate('HomeTab')}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  content: { paddingBottom: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  orderLabel: { ...typography.bodyStrong, color: colors.text },
  date: { ...typography.caption, color: colors.mutedText },
  itemCount: { ...typography.caption, color: colors.mutedText, marginTop: spacing.xs },
  total: { ...typography.h2, color: colors.secondary, marginTop: spacing.xs },
});
