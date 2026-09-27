import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  TOKEN: 'foodnest:authToken',
  EMAIL: 'foodnest:userEmail',
  NAME: 'foodnest:userName',
};

export function AuthProvider({ children }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null); // { email, name }

  useEffect(() => {
    (async () => {
      try {
        const [token, email, name] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.EMAIL),
          AsyncStorage.getItem(STORAGE_KEYS.NAME),
        ]);
        if (token && email) {
          setAuthToken(token);
          setUser({ email, name: name || '' });
        }
      } catch (err) {
        // Corrupt/unavailable storage shouldn't crash startup — treat as logged out.
        console.warn('Failed to restore session', err);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    if (!result?.success) {
      throw new Error(result?.errors || 'Invalid email or password.');
    }
    // The backend only returns a JWT containing the user id — it does not
    // expose a "get profile" endpoint, so the display name is not available
    // after login (only after a signup performed in this session). See
    // README > Known Backend Limitations.
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, result.authToken);
    await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, email);
    setAuthToken(result.authToken);
    setUser((prev) => ({ email, name: prev?.email === email ? prev.name : '' }));
  };

  const signup = async ({ name, email, password, location }) => {
    const result = await authService.signup({ name, email, password, location });
    if (!result?.success) {
      throw new Error(
        Array.isArray(result?.errors)
          ? result.errors.map((e) => e.msg).join(', ')
          : 'Could not create your account.'
      );
    }
    await AsyncStorage.setItem(STORAGE_KEYS.NAME, name);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.EMAIL, STORAGE_KEYS.NAME]);
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isInitializing,
      isAuthenticated: Boolean(authToken && user?.email),
      authToken,
      user,
      login,
      signup,
      logout,
    }),
    [isInitializing, authToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
