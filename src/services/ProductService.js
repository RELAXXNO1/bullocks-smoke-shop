import { db } from '@/config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';

class ProductService {
  constructor() {
    this.productsRef = collection(db, 'products');
  }

  async getAllProducts() {
    try {
      const snapshot = await getDocs(this.productsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      const q = query(this.productsRef, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const docRef = doc(this.productsRef, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async searchProducts(query) {
    try {
      const snapshot = await getDocs(this.productsRef);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async updateStock(productId, quantity) {
    try {
      const docRef = doc(this.productsRef, productId);
      await updateDoc(docRef, {
        stock: increment(-quantity)
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      const q = query(this.productsRef, where('featured', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  async getNewArrivals(limit = 8) {
    try {
      const q = query(this.productsRef, where('isNewArrival', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();