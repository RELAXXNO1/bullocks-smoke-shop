import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useStaticContent = (pageId) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'static_pages', pageId),
      (doc) => {
        if (doc.exists()) {
          setContent(doc.data().content);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching content:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [pageId]);

  return { content, loading, error };
};