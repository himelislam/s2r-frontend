// import { useState } from 'react';

// const useEmailEditableContent = () => {
//   // State for managing all content and styles in a single object
//   const [content, setContent] = useState({
//     logo: {
//       content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '24px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#000000',
//         padding: '10px',
//         borderRadius: '8px',
//         height: '150px',
//         width: '150px',
//       },
//     },
//     header: {
//       content: '{{referrerName}} Sent You a Special Offer!',
//       styles: {
//         backgroundColor: '#f0f0f0',
//         fontSize: '28px',
//         fontFamily: 'Georgia, serif',
//         color: '#333333',
//         padding: '10px',
//         borderRadius: '8px',
//         textAlign: 'center',
//       },
//     },
//     description1: {
//       content: 'Hi there! {{referrerName}} thought you might love this exclusive offer from {{businessName}}.',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '18px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#555555',
//         padding: '10px',
//         borderRadius: '8px',
//         textAlign: 'center',
//       },
//     },
//     couponCode: {
//       content: '{{code}}',
//       styles: {
//         backgroundColor: '#ffeb3b',
//         fontSize: '32px',
//         fontFamily: 'Courier New, monospace',
//         color: '#000000',
//         padding: '15px',
//         borderRadius: '8px',
//         textAlign: 'center',
//         border: '2px dashed #000000',
//       },
//     },
//     description2: {
//       content: 'Use the coupon code above to get 50% off your first purchase at {{businessName}}. Hurry, this offer is valid for a limited time only!',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '18px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#555555',
//         padding: '10px',
//         borderRadius: '8px',
//         textAlign: 'center',
//       },
//     },
//   });

//   // Helper function to update content
//   const updateContent = (section, newContent) => {
//     setContent((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         content: newContent,
//       },
//     }));
//   };

//   // Helper function to update styles
//   const updateStyles = (section, newStyles) => {
//     setContent((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         styles: newStyles,
//       },
//     }));
//   };

//   // Convert the content object to JSON
//   const getContentAsJSON = () => {
//     return JSON.stringify(content);
//   };

//   return {
//     content,
//     updateContent,
//     updateStyles,
//     getContentAsJSON,
//     setContent,
//   };
// };

// export default useEmailEditableContent;


import { useState, useCallback } from 'react';

const DEFAULT_STYLES = {
  text: {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    padding: '8px',
    lineHeight: '1.5'
  },
  heading: {
    fontSize: '24px',
    fontFamily: 'Georgia, serif',
    padding: '12px',
    fontWeight: 'bold'
  },
  coupon: {
    fontSize: '24px',
    fontFamily: 'Courier New, monospace',
    padding: '15px',
    border: '2px dashed #000000',
    backgroundColor: '#ffeb3b'
  }
};

const DEFAULT_TEMPLATES = {
  welcome: {
    subject: 'Welcome to {{businessName}}!',
    logo: {
      content: 'https://example.com/default-logo.jpg',
      styles: {
        ...DEFAULT_STYLES.text,
        height: '150px',
        width: '150px',
        borderRadius: '8px'
      }
    },
    header: {
      content: 'Welcome {{customerName}}!',
      styles: {
        ...DEFAULT_STYLES.heading,
        textAlign: 'center'
      }
    },
    body: {
      content: 'Thank you for joining {{businessName}}. We\'re excited to have you on board!',
      styles: {
        ...DEFAULT_STYLES.text,
        textAlign: 'center'
      }
    },
    footer: {
      content: 'Best regards,\n{{yourName}}\n{{businessName}}',
      styles: {
        ...DEFAULT_STYLES.text,
        fontSize: '14px'
      }
    }
  },
  reward: {
    subject: '{{referrerName}} sent you a reward!',
    logo: {
      content: 'https://example.com/default-logo.jpg',
      styles: {
        ...DEFAULT_STYLES.text,
        height: '150px',
        width: '150px',
        borderRadius: '8px'
      }
    },
    header: {
      content: '{{referrerName}} sent you a special offer!',
      styles: {
        ...DEFAULT_STYLES.heading,
        textAlign: 'center'
      }
    },
    description1: {
      content: 'Hi there! {{referrerName}} thought you might love this exclusive offer from {{businessName}}.',
      styles: {
        ...DEFAULT_STYLES.text,
        textAlign: 'center'
      }
    },
    couponCode: {
      content: '{{code}}',
      styles: DEFAULT_STYLES.coupon
    },
    description2: {
      content: 'Use this code to get your special discount at {{businessName}}!',
      styles: {
        ...DEFAULT_STYLES.text,
        textAlign: 'center'
      }
    }
  }
};

const useEmailEditableContent = (initialTemplateType = 'welcome') => {
  const [templateType, setTemplateType] = useState(initialTemplateType);
  const [content, setContent] = useState(DEFAULT_TEMPLATES[initialTemplateType]);
  const [history, setHistory] = useState([{...DEFAULT_TEMPLATES[initialTemplateType]}]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const recordHistory = useCallback((newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, {...newContent}]);
    setHistoryIndex(newHistory.length);
  }, [history, historyIndex]);

  const updateTemplateType = useCallback((type) => {
    setTemplateType(type);
    setContent(DEFAULT_TEMPLATES[type]);
    setHistory([{...DEFAULT_TEMPLATES[type]}]);
    setHistoryIndex(0);
  }, []);

  const updateSubject = useCallback((newSubject) => {
    const newState = { ...content, subject: newSubject };
    recordHistory(newState);
    setContent(newState);
  }, [content, recordHistory]);

  const updateContent = useCallback((section, newContent) => {
    if (!content[section]) {
      console.error(`Invalid section: ${section}`);
      return;
    }
    
    const newState = {
      ...content,
      [section]: { ...content[section], content: newContent }
    };
    
    recordHistory(newState);
    setContent(newState);
  }, [content, recordHistory]);

  const updateStyles = useCallback((section, newStyles) => {
    if (!content[section]) {
      console.error(`Invalid section: ${section}`);
      return;
    }
    
    const newState = {
      ...content,
      [section]: { 
        ...content[section], 
        styles: { ...content[section].styles, ...newStyles } 
      }
    };
    
    recordHistory(newState);
    setContent(newState);
  }, [content, recordHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const getContentAsJSON = useCallback(() => {
    return JSON.stringify(content);
  }, [content]);

  const getContentAsHTML = useCallback(() => {
    let html = `<html><body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">`;
    
    // Add logo if exists
    if (content.logo?.content) {
      html += `<div style="text-align: center; margin-bottom: 20px;">
        <img src="${content.logo.content}" alt="Logo" style="${cssObjectToString(content.logo.styles)}" />
      </div>`;
    }
    
    // Add all other sections
    Object.entries(content).forEach(([key, section]) => {
      if (key !== 'logo' && key !== 'subject' && section?.content) {
        html += `<div style="${cssObjectToString(section.styles)}">${section.content}</div>`;
      }
    });
    
    html += `</body></html>`;
    return html;
  }, [content]);

  const cssObjectToString = (styles) => {
    return Object.entries(styles || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  };

  return {
    templateType,
    content,
    updateTemplateType,
    updateSubject,
    updateContent,
    updateStyles,
    getContentAsJSON,
    getContentAsHTML,
    setContent,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};

export default useEmailEditableContent;