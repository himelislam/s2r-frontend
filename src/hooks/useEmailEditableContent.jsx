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
      content: 'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg',
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
      content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
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

const useEmailEditableContent = () => {
  // Separate states for welcome and reward emails
  const [welcomeContent, setWelcomeContent] = useState(DEFAULT_TEMPLATES.welcome);
  const [rewardContent, setRewardContent] = useState(DEFAULT_TEMPLATES.reward);
  
  // History states for undo/redo
  const [welcomeHistory, setWelcomeHistory] = useState([{...DEFAULT_TEMPLATES.welcome}]);
  const [rewardHistory, setRewardHistory] = useState([{...DEFAULT_TEMPLATES.reward}]);
  const [welcomeHistoryIndex, setWelcomeHistoryIndex] = useState(0);
  const [rewardHistoryIndex, setRewardHistoryIndex] = useState(0);

  // Current template type
  const [templateType, setTemplateType] = useState('welcome');

  // Record history for current template type
  const recordHistory = useCallback((newContent, type) => {
    if (type === 'welcome') {
      const newHistory = welcomeHistory.slice(0, welcomeHistoryIndex + 1);
      setWelcomeHistory([...newHistory, {...newContent}]);
      setWelcomeHistoryIndex(newHistory.length);
    } else {
      const newHistory = rewardHistory.slice(0, rewardHistoryIndex + 1);
      setRewardHistory([...newHistory, {...newContent}]);
      setRewardHistoryIndex(newHistory.length);
    }
  }, [welcomeHistory, rewardHistory, welcomeHistoryIndex, rewardHistoryIndex]);

  // Update template type
  const updateTemplateType = useCallback((type) => {
    setTemplateType(type);
  }, []);

  // Update subject for current template
  const updateSubject = useCallback((newSubject, type) => {
    if (type === 'welcome') {
      const newState = { ...welcomeContent, subject: newSubject };
      recordHistory(newState, 'welcome');
      setWelcomeContent(newState);
    } else {
      const newState = { ...rewardContent, subject: newSubject };
      recordHistory(newState, 'reward');
      setRewardContent(newState);
    }
  }, [welcomeContent, rewardContent, recordHistory]);

  // Update content for current template
  const updateContent = useCallback((section, newContent, type) => {
    if (type === 'welcome') {
      if (!welcomeContent[section]) {
        console.error(`Invalid section: ${section}`);
        return;
      }
      
      const newState = {
        ...welcomeContent,
        [section]: { ...welcomeContent[section], content: newContent }
      };
      
      recordHistory(newState, 'welcome');
      setWelcomeContent(newState);
    } else {
      if (!rewardContent[section]) {
        console.error(`Invalid section: ${section}`);
        return;
      }
      
      const newState = {
        ...rewardContent,
        [section]: { ...rewardContent[section], content: newContent }
      };
      
      recordHistory(newState, 'reward');
      setRewardContent(newState);
    }
  }, [welcomeContent, rewardContent, recordHistory]);

  // Update styles for current template
  const updateStyles = useCallback((section, newStyles, type) => {
    if (type === 'welcome') {
      if (!welcomeContent[section]) {
        console.error(`Invalid section: ${section}`);
        return;
      }
      
      const newState = {
        ...welcomeContent,
        [section]: { 
          ...welcomeContent[section], 
          styles: { ...welcomeContent[section].styles, ...newStyles } 
        }
      };
      
      recordHistory(newState, 'welcome');
      setWelcomeContent(newState);
    } else {
      if (!rewardContent[section]) {
        console.error(`Invalid section: ${section}`);
        return;
      }
      
      const newState = {
        ...rewardContent,
        [section]: { 
          ...rewardContent[section], 
          styles: { ...rewardContent[section].styles, ...newStyles } 
        }
      };
      
      recordHistory(newState, 'reward');
      setRewardContent(newState);
    }
  }, [welcomeContent, rewardContent, recordHistory]);

  // Undo for current template
  const undo = useCallback((type) => {
    if (type === 'welcome') {
      if (welcomeHistoryIndex > 0) {
        setWelcomeHistoryIndex(prev => prev - 1);
        setWelcomeContent(welcomeHistory[welcomeHistoryIndex - 1]);
      }
    } else {
      if (rewardHistoryIndex > 0) {
        setRewardHistoryIndex(prev => prev - 1);
        setRewardContent(rewardHistory[rewardHistoryIndex - 1]);
      }
    }
  }, [welcomeHistory, rewardHistory, welcomeHistoryIndex, rewardHistoryIndex]);

  // Redo for current template
  const redo = useCallback((type) => {
    if (type === 'welcome') {
      if (welcomeHistoryIndex < welcomeHistory.length - 1) {
        setWelcomeHistoryIndex(prev => prev + 1);
        setWelcomeContent(welcomeHistory[welcomeHistoryIndex + 1]);
      }
    } else {
      if (rewardHistoryIndex < rewardHistory.length - 1) {
        setRewardHistoryIndex(prev => prev + 1);
        setRewardContent(rewardHistory[rewardHistoryIndex + 1]);
      }
    }
  }, [welcomeHistory, rewardHistory, welcomeHistoryIndex, rewardHistoryIndex]);

  // Get JSON for both templates
  const getContentAsJSON = useCallback(() => {
    return JSON.stringify({
      welcome: welcomeContent,
      reward: rewardContent
    });
  }, [welcomeContent, rewardContent]);

  // Get HTML for specific template
  const getContentAsHTML = useCallback((type) => {
    const currentContent = type === 'welcome' ? welcomeContent : rewardContent;
    let html = `<html><body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">`;
    
    // Add logo if exists
    if (currentContent.logo?.content) {
      html += `<div style="text-align: center; margin-bottom: 20px;">
        <img src="${currentContent.logo.content}" alt="Logo" style="${cssObjectToString(currentContent.logo.styles)}" />
      </div>`;
    }
    
    // Add all other sections
    Object.entries(currentContent).forEach(([key, section]) => {
      if (key !== 'logo' && key !== 'subject' && section?.content) {
        html += `<div style="${cssObjectToString(section.styles)}">${section.content}</div>`;
      }
    });
    
    html += `</body></html>`;
    return html;
  }, [welcomeContent, rewardContent]);

  // Helper to convert CSS object to string
  const cssObjectToString = (styles) => {
    return Object.entries(styles || {})
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  };

  // Set content from external source (like API)
  const setContent = useCallback((newContent, type) => {
    if (type === 'welcome') {
      setWelcomeContent(newContent);
      setWelcomeHistory([{...newContent}]);
      setWelcomeHistoryIndex(0);
    } else {
      setRewardContent(newContent);
      setRewardHistory([{...newContent}]);
      setRewardHistoryIndex(0);
    }
  }, []);

  return {
    templateType,
    welcomeContent,
    rewardContent,
    updateTemplateType,
    updateSubject,
    updateContent,
    updateStyles,
    getContentAsJSON,
    getContentAsHTML,
    setContent,
    undo,
    redo,
    canUndo: (type) => type === 'welcome' ? welcomeHistoryIndex > 0 : rewardHistoryIndex > 0,
    canRedo: (type) => type === 'welcome' 
      ? welcomeHistoryIndex < welcomeHistory.length - 1 
      : rewardHistoryIndex < rewardHistory.length - 1
  };
};

export default useEmailEditableContent;