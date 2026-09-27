import { filterByCategory, searchFood } from '../services/foodService';

const items = [
  { id: '1', name: 'Dove', categoryName: 'Shampoo', description: 'Moisture shampoo' },
  { id: '2', name: 'Lays', categoryName: 'Chips', description: 'Crispy potato chips' },
  { id: '3', name: 'Dairy Milk', categoryName: 'Chocolate', description: 'Milk chocolate bar' },
];

describe('filterByCategory', () => {
  it('returns everything for "All" or empty category', () => {
    expect(filterByCategory(items, null)).toHaveLength(3);
    expect(filterByCategory(items, 'All')).toHaveLength(3);
  });
  it('filters to the matching category only', () => {
    expect(filterByCategory(items, 'Chips')).toHaveLength(1);
  });
});

describe('searchFood', () => {
  it('matches by name, category, or description (case-insensitive)', () => {
    expect(searchFood(items, 'dove')).toHaveLength(1);
    expect(searchFood(items, 'CHOCOLATE')).toHaveLength(1);
    expect(searchFood(items, 'crispy')).toHaveLength(1);
  });
  it('returns everything for an empty query', () => {
    expect(searchFood(items, '   ')).toHaveLength(3);
  });
  it('returns no results for an unmatched query', () => {
    expect(searchFood(items, 'pizza')).toHaveLength(0);
  });
});
