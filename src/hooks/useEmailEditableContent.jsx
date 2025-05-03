import { useState } from 'react';

const useEmailEditableContent = () => {
  // State for managing all content and styles in a single object
  const [content, setContent] = useState({
    logo: {
      content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        padding: '10px',
        borderRadius: '8px',
        height: '150px',
        width: '150px',
      },
    },
    header: {
      content: '{{referrerName}} Sent You a Special Offer!',
      styles: {
        backgroundColor: '#f0f0f0',
        fontSize: '28px',
        fontFamily: 'Georgia, serif',
        color: '#333333',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
      },
    },
    description1: {
      content: 'Hi there! {{referrerName}} thought you might love this exclusive offer from {{businessName}}.',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#555555',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
      },
    },
    couponCode: {
      content: '{{code}}',
      styles: {
        backgroundColor: '#ffeb3b',
        fontSize: '32px',
        fontFamily: 'Courier New, monospace',
        color: '#000000',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        border: '2px dashed #000000',
      },
    },
    description2: {
      content: 'Use the coupon code above to get 50% off your first purchase at {{businessName}}. Hurry, this offer is valid for a limited time only!',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#555555',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
      },
    },
  });

  // Helper function to update content
  const updateContent = (section, newContent) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        content: newContent,
      },
    }));
  };

  // Helper function to update styles
  const updateStyles = (section, newStyles) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        styles: newStyles,
      },
    }));
  };

  // Convert the content object to JSON
  const getContentAsJSON = () => {
    return JSON.stringify(content);
  };

  return {
    content,
    updateContent,
    updateStyles,
    getContentAsJSON,
    setContent,
  };
};

export default useEmailEditableContent;