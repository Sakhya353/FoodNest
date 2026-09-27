import { apiPost } from './apiClient';

// Matches server/Routes/OrderData.js.
//
// IMPORTANT — backend data shape (do not "improve" without changing the
// server): orders are NOT stored as individual documents with their own id
// and status. There is exactly one Order document per user email
// (server/models/Orders.js has `email: { unique: true }`), and every
// checkout pushes a new entry onto that single document's order_data array:
//   order_data: [ [ {Order_date}, {item}, {item}, ... ], [ ... ], ... ]
// So an individual "order" only has a position/date, not its own database
// id or a status field. The UI below treats the order's date as its
// identity and does not display a fabricated order id or status.

export async function placeOrder({ items, email }) {
  const orderDate = new Date().toDateString();
  const json = await apiPost('/orderData', {
    order_data: items, // [{ id, name, qty, size, price, img }, ...]
    email,
    order_date: orderDate,
  });
  return { ...json, orderDate };
}

export async function fetchMyOrders(email) {
  const json = await apiPost('/myOrderData', { email });
  const raw = json?.orderData?.order_data ?? [];

  // Each entry's first element is `{ Order_date }`, the rest are food items.
  const orders = raw
    .map((entry) => {
      const [first, ...rest] = entry;
      const items = rest;
      const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      return {
        date: first?.Order_date ?? null,
        items,
        total,
      };
    })
    .filter((o) => o.date)
    .reverse(); // most recent first, matching the existing website's behaviour

  return orders;
}

export default { placeOrder, fetchMyOrders };
