import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import HomeScreen from '../screens/home/HomeScreen';
import FoodListScreen from '../screens/food/FoodListScreen';
import FoodDetailsScreen from '../screens/food/FoodDetailsScreen';

const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.text,
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FoodList" component={FoodListScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ title: 'Food Details' }} />
    </Stack.Navigator>
  );
}
