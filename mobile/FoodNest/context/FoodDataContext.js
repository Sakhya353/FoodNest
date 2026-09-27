import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { fetchFoodData } from '../services/foodService';

const FoodDataContext = createContext(null);

export function FoodDataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFoodData();
      setItems(data.items);
      setCategories(data.categories);
      setHasLoadedOnce(true);
    } catch (err) {
      setError(err.friendlyMessage || 'Could not load the menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ items, categories, isLoading, error, hasLoadedOnce, load }),
    [items, categories, isLoading, error, hasLoadedOnce, load]
  );

  return <FoodDataContext.Provider value={value}>{children}</FoodDataContext.Provider>;
}

export function useFoodData() {
  const ctx = useContext(FoodDataContext);
  if (!ctx) throw new Error('useFoodData must be used within a FoodDataProvider');
  return ctx;
}

export default FoodDataContext;
