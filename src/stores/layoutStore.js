import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { db } from '@/config/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

// Default components with their settings
const defaultComponents = [
  {
    id: 'header',
    type: 'header',
    name: 'Header',
    order: 0,
    visible: true,
    settings: {
      showSearch: true,
      showCart: true,
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      announcement: 'Welcome to Bullocks Smoke Shop',
      logo: null,
      isSticky: true
    }
  },
  {
    id: 'hero',
    type: 'hero',
    name: 'Hero Banner',
    order: 1,
    visible: true,
    settings: {
      slides: [
        {
          id: nanoid(),
          image: 'https://images.unsplash.com/photo-1518911710364-17ec553bde5d',
          title: 'Premium Tobacco Collection',
          subtitle: 'Discover our finest selection of hand-picked tobacco',
          buttonText: 'Shop Now',
          buttonLink: '/products'
        }
      ],
      autoplay: true,
      interval: 5000,
      showArrows: true,
      showDots: true,
      fullHeight: false,
      overlayOpacity: 0.4
    }
  },
  {
    id: 'categories',
    type: 'categories',
    name: 'Product Categories',
    order: 2,
    visible: true,
    settings: {
      layout: 'grid', // grid, carousel
      columns: 4,
      showImages: true,
      showCount: true,
      style: 'card', // card, minimal, modern
      backgroundColor: '#F9FAFB',
      padding: 'medium' // small, medium, large
    }
  },
  {
    id: 'featured',
    type: 'featured',
    name: 'Featured Products',
    order: 3,
    visible: true,
    settings: {
      title: 'Featured Products',
      subtitle: 'Our most popular items',
      layout: 'grid', // grid, carousel
      columns: 4,
      productsToShow: 8,
      sortBy: 'featured', // featured, newest, bestselling
      showRating: true,
      showPrice: true,
      showStock: true,
      backgroundColor: '#FFFFFF',
      padding: 'medium'
    }
  }
];

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      components: defaultComponents,
      selectedComponent: null,
      previewMode: 'desktop', // desktop, tablet, mobile
      isDragging: false,
      isEditing: false,
      history: [],
      currentHistoryIndex: -1,

      // Component Management
      setComponents: (components) => {
        const currentState = get().components;
        set(state => ({
          components,
          history: [...state.history.slice(0, state.currentHistoryIndex + 1), currentState],
          currentHistoryIndex: state.currentHistoryIndex + 1
        }));
        updateLayoutInFirestore(components);
      },

      addComponent: (component) => {
        const newComponent = {
          ...component,
          id: nanoid(),
          order: get().components.length,
          visible: true
        };
        set(state => ({
          components: [...state.components, newComponent],
          history: [...state.history.slice(0, state.currentHistoryIndex + 1), state.components],
          currentHistoryIndex: state.currentHistoryIndex + 1
        }));
        updateLayoutInFirestore([...get().components, newComponent]);
      },

      updateComponent: (id, updates) => {
        set(state => {
          const newComponents = state.components.map(comp =>
            comp.id === id ? { ...comp, ...updates } : comp
          );
          return {
            components: newComponents,
            history: [...state.history.slice(0, state.currentHistoryIndex + 1), state.components],
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        });
        updateLayoutInFirestore(get().components);
      },

      removeComponent: (id) => {
        set(state => ({
          components: state.components.filter(comp => comp.id !== id),
          history: [...state.history.slice(0, state.currentHistoryIndex + 1), state.components],
          currentHistoryIndex: state.currentHistoryIndex + 1
        }));
        updateLayoutInFirestore(get().components.filter(comp => comp.id !== id));
      },

      // Component Selection
      setSelectedComponent: (component) => set({ selectedComponent: component }),

      // Component Ordering
      moveComponent: (fromIndex, toIndex) => {
        set(state => {
          const newComponents = [...state.components];
          const [movedComponent] = newComponents.splice(fromIndex, 1);
          newComponents.splice(toIndex, 0, movedComponent);
          
          // Update order property for all components
          const updatedComponents = newComponents.map((comp, index) => ({
            ...comp,
            order: index
          }));

          return {
            components: updatedComponents,
            history: [...state.history.slice(0, state.currentHistoryIndex + 1), state.components],
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        });
        updateLayoutInFirestore(get().components);
      },

      // Preview Mode
      setPreviewMode: (mode) => set({ previewMode: mode }),

      // Drag State
      setIsDragging: (isDragging) => set({ isDragging }),

      // Edit State
      setIsEditing: (isEditing) => set({ isEditing }),

      // History Management
      undo: () => {
        const { currentHistoryIndex, history } = get();
        if (currentHistoryIndex > 0) {
          const newIndex = currentHistoryIndex - 1;
          const components = history[newIndex];
          set({ components, currentHistoryIndex: newIndex });
          updateLayoutInFirestore(components);
        }
      },

      redo: () => {
        const { currentHistoryIndex, history } = get();
        if (currentHistoryIndex < history.length - 1) {
          const newIndex = currentHistoryIndex + 1;
          const components = history[newIndex];
          set({ components, currentHistoryIndex: newIndex });
          updateLayoutInFirestore(components);
        }
      },

      // Reset to Default
      resetToDefault: () => {
        set(state => ({
          components: defaultComponents,
          history: [...state.history, state.components],
          currentHistoryIndex: state.history.length
        }));
        updateLayoutInFirestore(defaultComponents);
      }
    }),
    {
      name: 'layout-store',
      version: 1,
    }
  )
);

// Firestore Integration
const updateLayoutInFirestore = async (components) => {
  try {
    const storeDoc = doc(db, 'stores', 'current'); // Adjust the path as needed
    await updateDoc(storeDoc, {
      layout: components
    });
  } catch (error) {
    console.error('Error updating layout in Firestore:', error);
  }
};

// Initialize Firestore sync
let unsubscribe;
export const initializeLayoutSync = (storeId = 'current') => {
  if (unsubscribe) unsubscribe();
  
  unsubscribe = onSnapshot(doc(db, 'stores', storeId), (doc) => {
    if (doc.exists() && doc.data().layout) {
      useLayoutStore.setState({ components: doc.data().layout });
    }
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
};
