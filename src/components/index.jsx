import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Navigation />
        <SocialLinks />
        
        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Bullocks Smoke Shop. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Must be 21 or older to purchase. Please consume responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
