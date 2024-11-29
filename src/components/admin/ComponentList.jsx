import React from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableComponent from './SortableComponent';
import { useLayoutStore } from '../../../stores/layoutStore';

const ComponentList = () => {
  const { 
    layout,
    selectedComponent,
    setSelectedComponent,
    toggleComponentVisibility,
    reorderComponents
  } = useLayoutStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      reorderComponents(active.id, over.id);
    }
  };

  if (!layout?.components) return null;

  return (
    <div className="w-64 bg-white border-r overflow-y-auto p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Components</h3>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layout.components}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {layout.components
              .sort((a, b) => a.order - b.order)
              .map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableComponent
                    component={component}
                    onVisibilityToggle={toggleComponentVisibility}
                  />
                </motion.div>
              ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ComponentList;