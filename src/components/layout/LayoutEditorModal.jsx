import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLayoutStore } from '../../../stores.jsx/layoutStore';
import LivePreview from './LivePreview';
import EditorToolbar from './EditorToolbar';
import ComponentList from './components/ComponentList';
import SettingsPanel from './panels/SettingsPanel';
import SaveButton from './SaveButton';

export default function LayoutEditorModal({ isOpen, onClose }) {
  const { selectedComponent, setSelectedComponent } = useLayoutStore();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform bg-gray-100 p-0 transition-all">
                {/* Editor Header */}
                <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Layout Editor
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Editor Content */}
                <div className="flex h-[calc(100vh-57px)]">
                  {/* Left Sidebar - Component List */}
                  <ComponentList />

                  {/* Main Content - Live Preview */}
                  <div className="flex-1 overflow-y-auto">
                    <EditorToolbar />
                    <LivePreview />
                  </div>

                  {/* Right Sidebar - Settings Panel */}
                  {selectedComponent && (
                    <SettingsPanel
                      selectedComponent={selectedComponent}
                      onClose={() => setSelectedComponent(null)}
                    />
                  )}
                </div>

                {/* Save Button */}
                <SaveButton />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}