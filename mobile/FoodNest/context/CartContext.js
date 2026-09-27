import React, { createContext, useContext, useMemo, useReducer } from 'react';

// Re-implements the intent of the existing website's cart reducer
// (client/src/components/ContextReducer.js) with clearer, safer logic:
// invalid quantities are rejected instead of silently producing NaN, and
// updating an existing line item recalculates its price instead of adding
// to it (the original web reducer's UPDATE case accumulates price on top of
// the previous price, which is a bug — not replicated here).

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item, size, qty, unitPrice } = action;
      const existingIndex = state.findIndex((line) => line.id === item.id && line.size === size);
      if (existingIndex !== -1) {
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + qty,
          price: unitPrice * (updated[existingIndex].qty + qty),
        };
        return updated;
      }
      return [
        ...state,
        {
          id: item.id,
          name: item.name,
          img: item.image,
          size,
          qty,
          unitPrice,
          price: unitPrice * qty,
        },
      ];
    }
    case 'SET_QTY': {
      const qty = Math.max(1, Math.floor(action.qty));
      return state.map((line) =>
        line.id === action.id && line.size === action.size
          ? { ...line, qty, price: line.unitPrice * qty }
          : line
      );
    }
    case 'REMOVE':
      return state.filter((line) => !(line.id === action.id && line.size === action.size));
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  const addItem = (item, size, qty, unitPrice) => dispatch({ type: 'ADD', item, size, qty, unitPrice });
  const setQuantity = (id, size, qty) => dispatch({ type: 'SET_QTY', id, size, qty });
  const removeItem = (id, size) => dispatch({ type: 'REMOVE', id, size });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = useMemo(() => items.reduce((sum, line) => sum + line.price, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, total, itemCount, addItem, setQuantity, removeItem, clearCart }),
    [items, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default CartContext;
