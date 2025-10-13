// Helper to get product image path with fallback
export const getProductImage = (imageName: string | undefined): string => {
  if (!imageName) {
    return "/images/default-product.png";
  }

  // Try to use the image from assets folder
  try {
    return `/assets/products/${imageName}`;
  } catch (error) {
    // Fallback to default image if not found
    return "/images/default-product.png";
  }
};

// Default product image (placeholder)
export const DEFAULT_PRODUCT_IMAGE = "/images/default-product.png";
