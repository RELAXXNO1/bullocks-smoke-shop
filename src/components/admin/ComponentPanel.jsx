import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { useLayoutStore } from '../../../../stores/layoutStore';
import ColorPicker from '../editors/ColorPicker';
import RichTextEditor from '../editors/RichTextEditor';
import ImageUploader from '../editors/ImageUploader';

const ComponentPanel = ({ component }) => {
  const { updateComponent } = useLayoutStore();

  const handleSettingChange = (key, value) => {
    updateComponent(component.id, {
      ...component.settings,
      [key]: value
    });
  };

  const tabs = [
    { name: 'Content', component: RichTextEditor },
    { name: 'Style', component: ColorPicker },
    { name: 'Media', component: ImageUploader }
  ];

  return (
    <div className="h-full flex flex-col">
      <Tab.Group>
        <Tab.List className="flex border-b">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors
                ${selected 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="flex-1 overflow-y-auto p-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>
              <tab.component
                settings={component.settings}
                onChange={handleSettingChange}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

ComponentPanel.propTypes = {
  component: PropTypes.shape({
    id: PropTypes.string.isRequired,
    settings: PropTypes.object
  }).isRequired
};

export default ComponentPanel;