import { create } from 'zustand';
import { layoutService } from '../services/layout.service';
import { produce } from 'immer';

const defaultLayout = {
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

export const useLayoutStore = create((set, get) => ({
  layout: defaultLayout,
  originalLayout: null,
  selectedComponent: null,
  loading: true,
  error: null,
  previewMode: 'desktop',
  hasChanges: false,

  setLayout: (layout) => set({ 
    layout,
    originalLayout: JSON.stringify(layout),
    hasChanges: false
  }),

  setSelectedComponent: (component) => set({ selectedComponent: component }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  fetchLayout: async () => {
    try {
      set({ loading: true, error: null });
      const layout = await layoutService.getLayout();
      set({ 
        layout: layout || defaultLayout,
        originalLayout: JSON.stringify(layout || defaultLayout),
        loading: false,
        hasChanges: false
      });
    } catch (error) {
      console.error('Failed to load layout:', error);
      set({ 
        layout: defaultLayout, 
        originalLayout: JSON.stringify(defaultLayout),
        error: 'Failed to load layout', 
        loading: false,
        hasChanges: false
      });
    }
  },

  updateComponent: (componentId, settings) => {
    set(produce((state) => {
      const component = state.layout.components.find(c => c.id === componentId);
      if (component) {
        Object.assign(component, settings);
        state.hasChanges = true;
      }
    }));
  },

  toggleComponentVisibility: (componentId) => {
    set(produce((state) => {
      const component = state.layout.components.find(c => c.id === componentId);
      if (component) {
        component.visible = !component.visible;
        state.hasChanges = true;
      }
    }));
  },

  reorderComponents: (activeId, overId) => {
    set(produce((state) => {
      const components = state.layout.components;
      const oldIndex = components.findIndex(c => c.id === activeId);
      const newIndex = components.findIndex(c => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedComponent] = components.splice(oldIndex, 1);
        components.splice(newIndex, 0, movedComponent);

        // Update order values
        components.forEach((component, index) => {
          component.order = index;
        });

        state.hasChanges = true;
      }
    }));
  },

  saveLayout: async () => {
    const { layout, hasChanges } = get();
    if (!hasChanges) return;

    try {
      await layoutService.saveLayout(layout);
      set({ 
        originalLayout: JSON.stringify(layout),
        hasChanges: false 
      });
    } catch (error) {
      console.error('Failed to save layout:', error);
      throw error;
    }
  },

  resetLayout: () => {
    set({ 
      layout: defaultLayout,
      originalLayout: JSON.stringify(defaultLayout),
      hasChanges: true
    });
  }
}));
