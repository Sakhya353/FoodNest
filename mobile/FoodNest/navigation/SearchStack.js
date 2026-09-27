import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import SearchScreen from '../screens/food/SearchScreen';
import FoodDetailsScreen from '../screens/food/FoodDetailsScreen';

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ title: 'Food Details' }} />
    </Stack.Navigator>
  );
}
