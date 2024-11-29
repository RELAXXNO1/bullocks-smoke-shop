import { motion } from 'framer-motion';

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'Twitter', href: '#', icon: 'twitter' }
];

export default function SocialLinks() {
  return (
    <div className="mt-8 flex justify-center space-x-6">
      {socialLinks.map((item) => (
        <motion.a
          key={item.name}
          href={item.href}
          className="text-gray-400 hover:text-gray-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="sr-only">{item.name}</span>
          <i className={`fab fa-${item.icon} text-xl`}></i>
        </motion.a>
      ))}
    </div>
  );
}