const SELLER_PHONE = '917357807298';
const SITE_URL = window.location.origin;

/**
 * Build a WhatsApp "Order on WhatsApp" URL for a single product.
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

/**
 * Build a WhatsApp checkout URL for a full cart order.
 */
export const getWhatsAppCartCheckoutUrl = (cartItems, customerInfo, grandTotal) => {
  let message = `Hello Kridhani Jewels,\n\nI would like to place an order.\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Phone: ${customerInfo.phone}\n`;
  message += `Address: ${customerInfo.address}\n`;
  message += `Landmark: ${customerInfo.landmark}\n`;
  message += `PIN Code: ${customerInfo.pinCode}\n\n`;
  message += `*Order Details:*\n\n`;

  cartItems.forEach((item, i) => {
    const subtotal = item.price * item.quantity;
    let line = `${i + 1}. ${item.name}`;
    if (item.selectedSize) line += ` (Size: ${item.selectedSize})`;
    line += ` - Qty: ${item.quantity} - ₹${subtotal}`;
    message += line + `\n`;
  });

  message += `\n*Grand Total: ₹${grandTotal}*\n\n`;
  message += `Please confirm my order.`;

  return `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(message)}`;
};
