import { apiPost } from './apiClient';
import { parsePriceFromOption } from '../utils/food';

// Matches server/Routes/DisplayData.js — a single POST /foodData endpoint
// that returns [food_items, foodCategory] as a raw two-element array
// (global.food_items / global.foodCategory, loaded once at server startup
// from the "food_items" and "foodCategory" MongoDB collections).
//
// There is no server-side search, filter, or pagination endpoint, so those
// are implemented client-side against this single payload — the same
// approach the existing React website uses.

function normalizeFoodItem(raw) {
  const options = raw.options?.[0] ?? {};
  const sizeKeys = Object.keys(options);
  const priceBySize = sizeKeys.reduce((acc, key) => {
    acc[key] = parsePriceFromOption(options[key]);
    return acc;
  }, {});
  const startingPrice = sizeKeys.length
    ? Math.min(...sizeKeys.map((k) => priceBySize[k]).filter((n) => !Number.isNaN(n)))
    : null;

  return {
    id: raw._id,
    name: raw.name,
    categoryName: raw.CategoryName,
    description: raw.description ?? '',
    image: raw.img,
    sizeOptions: sizeKeys, // e.g. ["half", "full"]
    priceBySize,           // { half: 130, full: 220 }
    startingPrice,         // used for card display; null if no options exist
  };
}

export async function fetchFoodData() {
  const [rawItems, rawCategories] = await apiPost('/foodData');
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeFoodItem) : [];
  const categories = Array.isArray(rawCategories)
    ? rawCategories.map((c) => c.CategoryName).filter(Boolean)
    : [];
  return { items, categories };
}

export function filterByCategory(items, categoryName) {
  if (!categoryName || categoryName === 'All') return items;
  return items.filter((item) => item.categoryName === categoryName);
}

export function searchFood(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.name?.toLowerCase().includes(q) ||
      item.categoryName?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
  );
}

export default { fetchFoodData, filterByCategory, searchFood };
