import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { db } from '../firebase/config';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

interface ComponentSettings {
  showSearch?: boolean;
  showCart?: boolean;
  backgroundColor?: string;
  textColor?: string;
  announcement?: string;
  logo?: string | null;
  isSticky?: boolean;
  [key: string]: any;
}

interface LayoutComponent {
  id: string;
  type: string;
  name: string;
  order: number;
  visible: boolean;
  settings: ComponentSettings;
}

interface LayoutState {
  components: LayoutComponent[];
  selectedComponent: LayoutComponent | null;
  loading: boolean;
  error: string | null;
  previewMode: 'desktop' | 'mobile' | 'tablet';
  isDragging: boolean;
  isEditing: boolean;
  history: {
    past: LayoutComponent[][];
    future: LayoutComponent[][];
  };
  hasChanges: boolean;
}

const defaultComponents: LayoutComponent[] = [
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
      title: 'Welcome to Our Store',
      subtitle: 'Discover our products',
      backgroundColor: '#F3F4F6',
      textColor: '#1F2937',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    }
  }
];

export const useLayoutStore = create(
  persist<LayoutState>(
    (set, get) => ({
      components: defaultComponents,
      selectedComponent: null,
      loading: false,
      error: null,
      previewMode: 'desktop',
      isDragging: false,
      isEditing: false,
      history: {
        past: [],
        future: []
      },
      hasChanges: false,

      // Component Management
      setComponents: (components: LayoutComponent[]) =>
        set(
          produce((state: LayoutState) => {
            state.components = components;
            state.hasChanges = true;
            state.history.past.push([...state.components]);
            state.history.future = [];
          })
        ),

      addComponent: (component: Partial<LayoutComponent>) =>
        set(
          produce((state: LayoutState) => {
            const newComponent = {
              id: nanoid(),
              type: component.type || 'custom',
              name: component.name || 'New Component',
              order: state.components.length,
              visible: true,
              settings: component.settings || {},
              ...component
            };
            state.components.push(newComponent);
            state.hasChanges = true;
            state.history.past.push([...state.components]);
            state.history.future = [];
          })
        ),

      updateComponent: (id: string, updates: Partial<LayoutComponent>) =>
        set(
          produce((state: LayoutState) => {
            const index = state.components.findIndex(c => c.id === id);
            if (index !== -1) {
              state.components[index] = { ...state.components[index], ...updates };
              state.hasChanges = true;
              state.history.past.push([...state.components]);
              state.history.future = [];
            }
          })
        ),

      removeComponent: (id: string) =>
        set(
          produce((state: LayoutState) => {
            state.components = state.components.filter(c => c.id !== id);
            state.hasChanges = true;
            state.history.past.push([...state.components]);
            state.history.future = [];
          })
        ),

      // Component Selection
      setSelectedComponent: (component: LayoutComponent | null) =>
        set({ selectedComponent: component }),

      // Component Ordering
      moveComponent: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: LayoutState) => {
            const component = state.components[fromIndex];
            state.components.splice(fromIndex, 1);
            state.components.splice(toIndex, 0, component);
            state.components.forEach((c, i) => (c.order = i));
            state.hasChanges = true;
            state.history.past.push([...state.components]);
            state.history.future = [];
          })
        ),

      // Preview Mode
      setPreviewMode: (mode: 'desktop' | 'mobile' | 'tablet') =>
        set({ previewMode: mode }),

      // Drag State
      setIsDragging: (isDragging: boolean) => set({ isDragging }),

      // Edit State
      setIsEditing: (isEditing: boolean) => set({ isEditing }),

      // History Management
      undo: () =>
        set(
          produce((state: LayoutState) => {
            if (state.history.past.length > 0) {
              const previous = state.history.past.pop()!;
              state.history.future.push([...state.components]);
              state.components = previous;
              state.hasChanges = true;
            }
          })
        ),

      redo: () =>
        set(
          produce((state: LayoutState) => {
            if (state.history.future.length > 0) {
              const next = state.history.future.pop()!;
              state.history.past.push([...state.components]);
              state.components = next;
              state.hasChanges = true;
            }
          })
        ),

      // Reset to Default
      resetToDefault: () =>
        set(
          produce((state: LayoutState) => {
            state.components = defaultComponents;
            state.history.past = [];
            state.history.future = [];
            state.hasChanges = false;
          })
        ),

      // Save Layout
      saveLayout: async () => {
        const state = get();
        try {
          await updateLayoutInFirestore(state.components);
          set({ hasChanges: false });
          return true;
        } catch (error) {
          set({ error: error.message });
          return false;
        }
      }
    }),
    {
      name: 'layout-store',
      version: 1,
    }
  )
);

// Firestore Integration
async function updateLayoutInFirestore(components: LayoutComponent[]) {
  const storeDoc = doc(db, 'stores', 'current');
  await updateDoc(storeDoc, {
    layout: components
  });
}

// Initialize Firestore sync
let unsubscribe: () => void;

export function initializeLayoutSync(storeId = 'current') {
  if (unsubscribe) {
    unsubscribe();
  }

  const storeDoc = doc(db, 'stores', storeId);
  unsubscribe = onSnapshot(storeDoc, (doc) => {
    if (doc.exists() && doc.data().layout) {
      useLayoutStore.getState().setComponents(doc.data().layout);
    }
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}
