// Stock and category utilities for inventory management

export const LOW_STOCK_THRESHOLD = 20;

export const CATEGORIES = [
  'Grains & Cereals',
  'Bakery',
  'Pulses & Lentils',
  'General Grocery',
];

export const CATEGORY_FILTERS = [
  'All',
  'Low Stock',
  'Grains & Cereals',
  'Bakery',
  'Pulses & Lentils',
];

/**
 * Check if an item is out of stock (<= 0)
 */
export const isOutOfStock = stock => {
  return Number(stock) <= 0;
};

/**
 * Check if an item is running low on stock (< 20 kg)
 */
export const isLowStock = stock => {
  const num = Number(stock);
  return num > 0 && num < LOW_STOCK_THRESHOLD;
};

/**
 * Get simple human-readable stock status and theme color key
 *
 * @param {number|string} stock
 * @param {string} unit
 * @returns {{ label: string, status: 'out_of_stock' | 'low_stock' | 'in_stock' }}
 */
export const getStockStatus = (stock, unit = 'kg') => {
  const num = Number(stock) || 0;

  if (num <= 0) {
    return {
      label: 'Out of Stock',
      status: 'out_of_stock',
    };
  }

  if (num < LOW_STOCK_THRESHOLD) {
    return {
      label: `Low Stock: ${num} ${unit}`,
      status: 'low_stock',
    };
  }

  return {
    label: `In Stock: ${num} ${unit}`,
    status: 'in_stock',
  };
};

/**
 * Determines default category from product name
 *
 * @param {string} name
 * @returns {string} Category name
 */
export const getItemCategory = name => {
  const lower = (name || '').toLowerCase();
  if (
    lower.includes('rice') ||
    lower.includes('wheat') ||
    lower.includes('corn') ||
    lower.includes('grain') ||
    lower.includes('flour')
  ) {
    return 'Grains & Cereals';
  }
  if (lower.includes('bread') || lower.includes('bun') || lower.includes('toast')) {
    return 'Bakery';
  }
  if (
    lower.includes('pulse') ||
    lower.includes('dal') ||
    lower.includes('lentil') ||
    lower.includes('bean')
  ) {
    return 'Pulses & Lentils';
  }
  return 'General Grocery';
};

export default {
  LOW_STOCK_THRESHOLD,
  CATEGORIES,
  CATEGORY_FILTERS,
  isOutOfStock,
  isLowStock,
  getStockStatus,
  getItemCategory,
};
