// Order Statuses
const OrderStatus = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const getAllStatuses = () => Object.values(OrderStatus);

// Utility Functions
const formatCurrency = (a) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(a);

const formatDate = (d) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

const getStatusClass = (status) =>
  ({
    Pending: "status-pending",
    Preparing: "status-preparing",
    "Out for Delivery": "status-out",
    Delivered: "status-delivered",
    Cancelled: "status-cancelled",
  }[status] || "");

// Chatbot Messages
const CHATBOT_MESSAGES = {
  greeting: "Hello and welcome to BLÜMEO 🌷 I’m your virtual floral assistant. I can help you track your order, recommend the perfect bouquet, or answer any questions about our services.",
  
  help: "Here’s how I can assist you today:\n• Track or check your order status\n• Recommend bouquets for any occasion\n• Provide delivery details and timings\n• Share pricing and availability\n• Help with custom or event orders\n• Assist with gift cards or special requests",
  
  orderStatus: "Of course 🌸 Please provide your order ID (e.g., ORD-20240729-001) or the recipient’s name, and I’ll check your order status right away.",
  
  delivery: "Our delivery hours are from 8:00 AM to 8:00 PM daily 🚚✨ Same-day delivery is available for orders placed before 2:00 PM. Would you like me to check delivery options for your area?",
  
  recommendations: "Here are some of our most loved arrangements:\n• 🌞 *Sunny Day Bouquet* (€35.99) – bright and cheerful\n• 🌹 *Rose Garden Delight* (€45.50) – timeless romance\n• 🤍 *Minimalist White* (€38.00) – elegant and pure\n• 💜 *Lavender Dreams* (€42.00) – calm and graceful\n• 🌸 *Pink Whisper* (€39.50) – soft and charming",
  
  pricing: "Our bouquets start from around €30 💐 Prices vary depending on size, flowers, and design. Would you like me to suggest something within your budget?",
  
  customization: "We love creating custom arrangements 🎨 Please share the occasion, color theme, or preferred flowers — and I’ll help design something truly unique.",
  
  occasion: "Is this for a birthday, anniversary, wedding, or perhaps a ‘just because’ surprise? 🎁 I can recommend bouquets perfectly suited for the occasion.",
  
  thankYou: "It’s been a pleasure assisting you 🌷 Wishing you a day as lovely as fresh flowers!",
  
  goodbye: "Thank you for visiting BLÜMEO 💐 We hope to bring a little beauty to your world again soon.",
  
  error: "I’m sorry, I didn’t quite catch that 🌼 Could you please rephrase or share a bit more detail?",
  
  contact: "You can also reach our floral specialists at support@blumeo.com or call +49 123 456 789 between 9 AM and 6 PM for personal assistance."
};
