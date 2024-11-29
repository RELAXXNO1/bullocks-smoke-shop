import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Compliance', href: '/compliance' }
  ]
};

export default function Navigation() {
  return (
    <nav className="flex flex-wrap justify-center -mx-5 -my-2">
      {navigation.main.map((item) => (
        <motion.div
          key={item.name}
          whileHover={{ scale: 1.05 }}
          className="px-5 py-2"
        >
          <Link
            to={item.href}
            className="text-base text-gray-400 hover:text-white transition-colors"
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}