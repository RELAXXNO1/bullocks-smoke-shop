import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center">
      <motion.span 
        className="text-white text-xl font-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Bullocks Smoke Shop
      </motion.span>
    </Link>
  );
}