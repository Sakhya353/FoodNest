import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import MyOrdersScreen from '../screens/orders/MyOrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details' }} />
    </Stack.Navigator>
  );
}
