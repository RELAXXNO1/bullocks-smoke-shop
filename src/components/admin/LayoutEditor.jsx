import { Fragment, useEffect } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TableCellsIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useLayoutStore } from '../../stores/layoutStore';
import ComponentList from './ComponentList';
import ComponentPanel from './ComponentPanel';
import ComponentTree from './ComponentTree';
import StorefrontPreview from '../StorefrontPreview';
import toast from 'react-hot-toast';

export function LayoutEditor({ isOpen, onClose }) {
  const {
    components,
    selectedComponent,
    previewMode,
    isDragging,
    history,
    currentHistoryIndex,
    setComponents,
    setSelectedComponent,
    setPreviewMode,
    setIsDragging,
    moveComponent,
    undo,
    redo,
    resetToDefault
  } = useLayoutStore();

  // Initialize layout sync with Firestore
  useEffect(() => {
    const cleanup = initializeLayoutSync();
    return () => cleanup();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);
    
    if (active.id !== over?.id) {
      const oldIndex = components.findIndex(comp => comp.id === active.id);
      const newIndex = components.findIndex(comp => comp.id === over.id);
      moveComponent(oldIndex, newIndex);
      toast.success('Component order updated');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setSelectedComponent(null);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the layout to default?')) {
      resetToDefault();
      toast.success('Layout reset to default');
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-white px-4 py-3 sm:px-6 flex justify-between items-center border-b">
                  <div className="flex items-center space-x-4">
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      Layout Editor
                    </Dialog.Title>
                    
                    {/* Device Preview Toggles */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-1.5 rounded-lg ${
                          previewMode === 'desktop'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ComputerDesktopIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('tablet')}
                        className={`p-1.5 rounded-lg ${
                          previewMode === 'tablet'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <TableCellsIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-1.5 rounded-lg ${
                          previewMode === 'mobile'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <DevicePhoneMobileIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* History Controls */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={undo}
                        disabled={currentHistoryIndex <= 0}
                        className={`p-1.5 rounded-lg ${
                          currentHistoryIndex <= 0
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={redo}
                        disabled={currentHistoryIndex >= history.length - 1}
                        className={`p-1.5 rounded-lg ${
                          currentHistoryIndex >= history.length - 1
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ArrowUturnRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Actions Menu */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                        Actions
                        <ChevronDownIcon className="h-5 w-5" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleReset}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                              >
                                Reset to Default
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => window.open('/', '_blank')}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                              >
                                View Live Site
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Components Panel */}
                  <div className="w-64 border-r bg-gray-50 flex flex-col">
                    <div className="p-4 border-b bg-white">
                      <h4 className="text-sm font-medium text-gray-900">Components</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                      >
                        <SortableContext
                          items={components}
                          strategy={verticalListSortingStrategy}
                        >
                          <ComponentTree />
                        </SortableContext>
                        <DragOverlay>
                          {isDragging && selectedComponent && (
                            <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-blue-500">
                              {selectedComponent.name}
                            </div>
                          )}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b bg-white">
                      <h4 className="text-sm font-medium text-gray-900">Preview</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
                      <div
                        className={`mx-auto transition-all duration-300 ${
                          previewMode === 'mobile'
                            ? 'max-w-sm'
                            : previewMode === 'tablet'
                            ? 'max-w-2xl'
                            : 'max-w-7xl'
                        }`}
                      >
                        <StorefrontPreview />
                      </div>
                    </div>
                  </div>

                  {/* Settings Panel */}
                  <AnimatePresence>
                    {selectedComponent && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l bg-gray-50 overflow-hidden"
                      >
                        <div className="p-4 border-b bg-white">
                          <h4 className="text-sm font-medium text-gray-900">
                            {selectedComponent.name} Settings
                          </h4>
                        </div>
                        <div className="p-4 overflow-y-auto h-full">
                          <ComponentPanel component={selectedComponent} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
