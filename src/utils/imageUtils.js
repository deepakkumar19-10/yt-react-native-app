// Product image resolution utility using high-quality grocery photography
export const PRODUCT_IMAGES = {
  wheat:
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  bread:
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  rice:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'basmati rice':
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
  pulse:
    'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  corn:
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  default:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
};

/**
 * Returns a matching product image URL based on item name.
 * Uses exact match first, then keyword matching, and falls back to a default grocery image.
 *
 * @param {string} name - The product name
 * @returns {string} Image URL
 */
export const getProductImage = name => {
  if (!name) return PRODUCT_IMAGES.default;

  const lower = name.trim().toLowerCase();

  // 1. Exact match in dictionary
  if (PRODUCT_IMAGES[lower]) {
    return PRODUCT_IMAGES[lower];
  }

  // 2. Keyword-based matching
  if (lower.includes('wheat')) return PRODUCT_IMAGES.wheat;
  if (lower.includes('bread')) return PRODUCT_IMAGES.bread;
  if (lower.includes('basmati')) return PRODUCT_IMAGES['basmati rice'];
  if (lower.includes('rice')) return PRODUCT_IMAGES.rice;
  if (lower.includes('pulse') || lower.includes('dal') || lower.includes('lentil')) {
    return PRODUCT_IMAGES.pulse;
  }
  if (lower.includes('corn')) return PRODUCT_IMAGES.corn;

  // 3. Clean default fallback
  return PRODUCT_IMAGES.default;
};

export default {
  PRODUCT_IMAGES,
  getProductImage,
};
