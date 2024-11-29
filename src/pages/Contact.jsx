import { useEffect } from 'react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { motion } from 'framer-motion';

export default function Contact() {
  const { content, loading, error } = useStaticContent('contact');

  useEffect(() => {
    document.title = 'Contact Us | Bullocks Smoke Shop';
  }, []);

  if (loading) {
    return <LoadingSkeleton type="content" count={3} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load content</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div 
        className="prose prose-blue max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.div>
  );
}