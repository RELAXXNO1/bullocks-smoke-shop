import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutStore } from '../../../stores.jsx/layoutStore';
import EditableComponent from './EditableComponent';
import PreviewFrame from './components/PreviewFrame';
import * as Components from './components';

const LivePreview = () => {
  const { 
    layout,
    previewMode,
    selectedComponent,
    setSelectedComponent
  } = useLayoutStore();

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const renderComponent = (component) => {
    const Component = Components[component.id.charAt(0).toUpperCase() + component.id.slice(1)];
    if (!Component) return null;

    return (
      <EditableComponent
        key={component.id}
        id={component.id}
        isSelected={selectedComponent?.id === component.id}
        onClick={() => setSelectedComponent(component)}
      >
        <Component settings={component.settings} />
      </EditableComponent>
    );
  };

  if (!layout) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <PreviewFrame width={getPreviewWidth()}>
        {layout.components
          .filter(component => component.visible)
          .sort((a, b) => a.order - b.order)
          .map(renderComponent)}
      </PreviewFrame>
    </div>
  );
};

export default LivePreview;