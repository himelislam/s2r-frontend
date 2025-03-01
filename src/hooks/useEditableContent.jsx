import { useState } from 'react';

const useEditableContent = () => {
  // State for managing all content and styles in a single object
  const [content, setContent] = useState({
    logo: {
      content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
      styles: {
        backgroundColor: '#ffffff',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        padding: '2px',
        borderRadius: '8px',
        height: '200px',
        width: '200px',
      },
    },
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
    form: {
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          placeholder: '',
          required: true,
          styles: {
            fontSize: '16px',
            color: '#000000',
            padding: '8px',
            borderRadius: '4px',
          },
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'm@example.com',
          required: true,
          styles: {
            fontSize: '16px',
            color: '#000000',
            padding: '8px',
            borderRadius: '4px',
          },
        },
      ],
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

  // const addFormField = (field) => {
  //   setContent((prev) => ({
  //     ...prev,
  //     form: {
  //       ...prev.form,
  //       fields: [...prev.form.fields, field],
  //     },
  //   }));
  // };

  const addFormField = (type) => {
    const newField = {
      phone: {
        id: 'phone',
        type: 'tel',
        label: 'Phone',
        placeholder: 'Enter phone number',
        required: false,
        styles: { /* default styles */ }
      },
      date: {
        id: 'date',
        type: 'date',
        label: 'Date',
        placeholder: '',
        required: false,
        styles: { /* default styles */ }
      }
    }[type];

    setContent(prev => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.some(f => f.id === newField.id) 
          ? prev.form.fields 
          : [...prev.form.fields, newField]
      }
    }));
  };

  const updateFormField = (fieldId, updatedField) => {
    setContent((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.map((field) =>
          field.id === fieldId ? updatedField : field
        ),
      },
    }));
  };

  // const deleteFormField = (fieldId) => {
  //   setContent((prev) => ({
  //     ...prev,
  //     form: {
  //       ...prev.form,
  //       fields: prev.form.fields.filter((field) => field.id !== fieldId),
  //     },
  //   }));
  // };

  const deleteFormField = (fieldId) => {
    if (['name', 'email'].includes(fieldId)) return; // Prevent deleting required fields
    
    setContent(prev => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.filter(f => f.id !== fieldId)
      }
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
    addFormField,
    updateFormField,
    deleteFormField
  };
};

export default useEditableContent;