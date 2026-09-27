import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { CartProvider, useCart } from '../context/CartContext';

const item = { id: 'food1', name: 'Veg Fried Rice', image: 'https://example.com/img.png' };

function Probe({ onReady }) {
  const cart = useCart();
  onReady(cart);
  return <Text>{cart.itemCount}</Text>;
}

function renderCart() {
  let cart;
  render(
    <CartProvider>
      <Probe onReady={(c) => { cart = c; }} />
    </CartProvider>
  );
  return () => cart;
}

describe('CartContext', () => {
  it('adds a new line item and computes total/qty', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item, 'half', 2, 130));
    expect(getCart().items).toHaveLength(1);
    expect(getCart().items[0].price).toBe(260);
    expect(getCart().total).toBe(260);
    expect(getCart().itemCount).toBe(2);
  });

  it('merges quantity when the same item/size is added again', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item, 'half', 1, 130));
    act(() => getCart().addItem(item, 'half', 2, 130));
    expect(getCart().items).toHaveLength(1);
    expect(getCart().items[0].qty).toBe(3);
    expect(getCart().items[0].price).toBe(390);
  });

  it('rejects quantities below 1 by clamping to 1', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item, 'half', 1, 130));
    act(() => getCart().setQuantity('food1', 'half', 0));
    expect(getCart().items[0].qty).toBe(1);
  });

  it('removes a line item', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item, 'half', 1, 130));
    act(() => getCart().removeItem('food1', 'half'));
    expect(getCart().items).toHaveLength(0);
    expect(getCart().total).toBe(0);
  });

  it('clears the cart', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item, 'half', 1, 130));
    act(() => getCart().clearCart());
    expect(getCart().items).toHaveLength(0);
  });
});
