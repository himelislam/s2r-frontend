import { useState } from 'react';

const useEditableContent = () => {
  // State for managing all content and styles in a single object
  const [content, setContent] = useState({
    header: {
      content: '{{referrerName}} Recommends {{businessName}}',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        padding: '2px',
        borderRadius: '8px',
      },
    },
    description1: {
      content: 'Looking to buy a car? Book a test drive with {{businessName}}',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        padding: '2px',
        borderRadius: '8px',
      },
    },
    description2: {
      content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        padding: '8px',
        borderRadius: '8px',
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
  };
};

export default useEditableContent;