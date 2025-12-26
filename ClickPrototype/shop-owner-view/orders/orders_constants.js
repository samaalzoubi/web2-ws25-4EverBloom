// Order Statuses
const OrderStatus = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Flower Items
const AVAILABLE_ITEMS = [
  { name: "Sunny Day Bouquet", price: 35.99 },
  { name: "Rose Garden Delight", price: 45.5 },
  { name: "Wildflower Wonder", price: 29.99 },
  { name: "Tulip Treasure", price: 42.0 },
  { name: "Orchid Oasis", price: 55.75 },
  { name: "Minimalist White", price: 38.0 },
];

// Customers
const mockCustomers = [
  { id: "CUST-001", name: "Alice Johnson", email: "alice@example.com", phone: "+1 234 567 8900", address: "123 Flower St, City" },
  { id: "CUST-002", name: "Bob Williams", email: "bob@example.com", phone: "+1 234 567 8901", address: "456 Garden Ave, City" },
  { id: "CUST-003", name: "Charlie Brown", email: "charlie@example.com", phone: "+1 234 567 8902", address: "789 Rose Lane, City" },
  { id: "CUST-004", name: "Diana Miller", email: "diana@example.com", phone: "+1 234 567 8903", address: "321 Tulip Rd, City" },
  { id: "CUST-005", name: "Ethan Davis", email: "ethan@example.com", phone: "+1 234 567 8904", address: "654 Orchid Blvd, City" },
  { id: "CUST-006", name: "Fiona Garcia", email: "fiona@example.com", phone: "+1 234 567 8905", address: "987 Lily St, City" },
];

const generateOrderItems = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const itemTemplate = AVAILABLE_ITEMS[Math.floor(Math.random() * AVAILABLE_ITEMS.length)];
    const existing = items.find((x) => x.name === itemTemplate.name);
    if (existing) existing.quantity += 1;
    else items.push({
      id: `ITEM-${Date.now()}-${i}`,
      ...itemTemplate,
      quantity: Math.floor(Math.random() * 3) + 1,
    });
  }
  return items;
};

const calculateTotal = (items) =>
  items.reduce((t, i) => t + i.price * i.quantity, 0);

const MOCK_ORDERS = [
  { id: "ORD-20240729-001", customer: mockCustomers[0], orderDate: "2024-07-29T10:30:00Z", items: generateOrderItems(2), status: OrderStatus.PENDING, notes: "Handle with care" },
  { id: "ORD-20240729-002", customer: mockCustomers[1], orderDate: "2024-07-29T11:45:00Z", items: generateOrderItems(1), status: OrderStatus.PREPARING, notes: "" },
  { id: "ORD-20240728-003", customer: mockCustomers[2], orderDate: "2024-07-28T14:00:00Z", items: generateOrderItems(3), status: OrderStatus.OUT_FOR_DELIVERY, notes: "Gift message included" },
  { id: "ORD-20240728-004", customer: mockCustomers[3], orderDate: "2024-07-28T09:15:00Z", items: generateOrderItems(1), status: OrderStatus.DELIVERED, notes: "" },
  { id: "ORD-20240727-005", customer: mockCustomers[4], orderDate: "2024-07-27T16:30:00Z", items: generateOrderItems(2), status: OrderStatus.DELIVERED, notes: "Customer requested morning delivery" },
  { id: "ORD-20240727-006", customer: mockCustomers[5], orderDate: "2024-07-27T18:00:00Z", items: generateOrderItems(1), status: OrderStatus.CANCELLED, notes: "Customer rescheduled" }
].map(o => ({ ...o, total: calculateTotal(o.items) }));

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
