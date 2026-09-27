// The existing "food_items" collection stores each size option as a string
// like "220 ml" rather than a plain number (see client/foodData2.json).
// The original web client (client/src/components/Card.js) derives a price
// by running parseInt() on that string, e.g. parseInt("220 ml") === 220,
// and treats the leading number as the price in rupees. This mirrors that
// exact behaviour so mobile totals match the website's totals.
export function parsePriceFromOption(optionValue) {
  const n = parseInt(optionValue, 10);
  return Number.isNaN(n) ? 0 : n;
}

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return `\u20B9${n}`; // matches the ₹ symbol used in MyOrder.js
}
