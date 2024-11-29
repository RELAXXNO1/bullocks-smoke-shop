export const env = {
  app: {
    name: import.meta.env.VITE_APP_NAME,
    url: import.meta.env.VITE_APP_URL,
    environment: import.meta.env.VITE_APP_ENV
  },
  api: {
    url: import.meta.env.VITE_API_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10)
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    auth: import.meta.env.VITE_ENABLE_AUTH === 'true',
    cart: import.meta.env.VITE_ENABLE_CART === 'true'
  }
};