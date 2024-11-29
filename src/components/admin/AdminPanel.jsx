import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  ChartBarIcon,
  Squares2X2Icon,
  ArrowUpTrayIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

import Analytics from './Analytics';
import ProductManager from './ProductManager';
import BulkUploader from './BulkUploader';
import { LayoutEditor } from './LayoutEditor';
import StoreSettings from './StoreSettings';
import PhotoBank  from '../product/PhotoBank';

const tabs = [
  { name: 'Analytics', icon: ChartBarIcon, component: Analytics },
  { name: 'Product Manager', icon: Squares2X2Icon, component: ProductManager },
  { name: 'Bulk Upload', icon: ArrowUpTrayIcon, component: BulkUploader },
  { name: 'Layout Editor', icon: PaintBrushIcon, component: null },
  { name: 'Store Settings', icon: Cog6ToothIcon, component: StoreSettings },
  { name: 'Photo Bank', icon: PhotoIcon, component: PhotoBank }
];

export default function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  const handleTabChange = (index) => {
    if (tabs[index].name === 'Layout Editor') {
      setShowLayoutEditor(true);
    } else {
      setSelectedTab(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
            <Tab.List className="flex space-x-1 bg-blue-50/50 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all flex items-center justify-center
                    ${
                      selected
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-500'
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center space-x-2">
                      <tab.icon className={`w-5 h-5 ${selected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span>{tab.name}</span>
                    </div>
                  )}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-2">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={`rounded-xl bg-white p-3
                    focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`}
                >
                  {tab.component && <tab.component />}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          <LayoutEditor
            isOpen={showLayoutEditor}
            onClose={() => setShowLayoutEditor(false)}
          />
        </div>
      </div>
    </div>
  );
}