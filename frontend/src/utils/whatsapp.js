const SELLER_PHONE = '917357807298';
const SITE_URL = window.location.origin;

/**
 * Build a WhatsApp "Order on WhatsApp" URL for a product.
 */
export const getWhatsAppOrderUrl = (product, selectedSize = null, currentPrice = null) => {
  const price = currentPrice || product.price;
  const productUrl = `${SITE_URL}/categories`;

  let message = `Hello Kridhani Jewels,\n\nI am interested in this product:\n\n`;
  message += `Product: ${product.name}\n`;
  message += `Price: ₹${price}\n`;
  message += `Category: ${product.category}\n`;
  if (selectedSize) {
    message += `Size: ${selectedSize}\n`;
  }
  message += `Product Link: ${productUrl}\n`;
  message += `\nPlease share more details.`;

  return `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(message)}`;
};
