import { motion } from 'framer-motion';
import ColorPicker from '../ColorPicker';

export default function ThemeSettings({ settings, onChange }) {
  const handleColorChange = (key, value) => {
    onChange({
      ...settings,
      theme: {
        ...settings.theme,
        [key]: value
      }
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h4 className="text-sm font-medium text-gray-900 mb-4">Theme Settings</h4>
      <div className="space-y-4">
        <ColorPicker
          label="Primary Color"
          value={settings.theme?.primaryColor || '#3B82F6'}
          onChange={(color) => handleColorChange('primaryColor', color)}
        />
        <ColorPicker
          label="Background Color"
          value={settings.theme?.backgroundColor || '#F3F4F6'}
          onChange={(color) => handleColorChange('backgroundColor', color)}
        />
      </div>
    </motion.section>
  );
}
