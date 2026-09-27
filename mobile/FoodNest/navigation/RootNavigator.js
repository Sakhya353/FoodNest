import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { isInitializing, isAuthenticated } = useAuth();

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
