import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { useCart } from '../context/CartContext';
import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import CartStack from './CartStack';
import OrdersStack from './OrdersStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const ICONS = {
  HomeTab: 'home',
  SearchTab: 'search',
  CartTab: 'cart',
  OrdersTab: 'receipt',
  ProfileTab: 'person',
};

function CartIconWithBadge({ color, size }) {
  const { itemCount } = useCart();
  return (
    <View>
      <Ionicons name={ICONS.CartTab} color={color} size={size} />
      {itemCount > 0 && (
        <View style={styles.badge} accessibilityLabel={`${itemCount} items in cart`}>
          <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) =>
          route.name === 'CartTab' ? (
            <CartIconWithBadge color={color} size={size} />
          ) : (
            <Ionicons name={ICONS[route.name]} color={color} size={size} />
          ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Explore' }} />
      <Tab.Screen name="CartTab" component={CartStack} options={{ title: 'Cart' }} />
      <Tab.Screen name="OrdersTab" component={OrdersStack} options={{ title: 'Orders' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
});
