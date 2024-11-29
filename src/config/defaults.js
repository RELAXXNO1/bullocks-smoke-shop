export const defaultStoreSettings = {
  features: {
    cart: false,
    userAccounts: true,
    reviews: false,
    wishlist: false
  },
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F3F4F6'
  },
  info: {
    name: 'Bullocks Smoke Shop',
    address: '400 Vernonview Dr\nMt Vernon, OH 43050',
    phone: '(740) 830-6002',
    email: 'info@bullocksmokeshop.com'
  },
  hours: {
    Monday: '8:00 AM - 11:00 PM',
    Tuesday: '8:00 AM - 11:00 PM',
    Wednesday: '8:00 AM - 11:00 PM',
    Thursday: '8:00 AM - 11:00 PM',
    Friday: '8:00 AM - 11:00 PM',
    Saturday: '8:00 AM - 11:00 PM',
    Sunday: '8:00 AM - 11:00 PM'
  }
};

export const defaultLayout = {
  components: [
    { id: 'header', name: 'Header', visible: true, order: 0 },
    { id: 'hero', name: 'Hero Banner', visible: true, order: 1 },
    { id: 'categories', name: 'Categories Grid', visible: true, order: 2 },
    { id: 'featured', name: 'Featured Products', visible: true, order: 3 },
    { id: 'footer', name: 'Footer', visible: true, order: 4 }
  ],
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F3F4F6'
  }
};