// import { useState } from 'react';

// const useEditableContent = () => {
//   // State for managing all content and styles in a single object
//   const [content, setContent] = useState({
//     logo: {
//       content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '24px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#000000',
//         padding: '2px',
//         borderRadius: '8px',
//         height: '200px',
//         width: '200px',
//       },
//     },
//     header: {
//       content: '{{referrerName}} Recommends {{businessName}}',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '24px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#000000',
//         padding: '2px',
//         borderRadius: '8px',
//       },
//     },
//     description1: {
//       content: 'Looking to buy a car? Book a test drive with {{businessName}}',
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '16px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#000000',
//         padding: '2px',
//         borderRadius: '8px',
//       },
//     },
//     description2: {
//       content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
//       styles: {
//         backgroundColor: '#ffffff',
//         fontSize: '16px',
//         fontFamily: 'Arial, sans-serif',
//         color: '#000000',
//         padding: '8px',
//         borderRadius: '8px',
//       },
//     },
//     form: {
//       fields: [
//         {
//           id: 'name',
//           type: 'text',
//           label: 'Name',
//           placeholder: '',
//           required: true,
//           styles: {
//             fontSize: '16px',
//             color: '#000000',
//             padding: '8px',
//             borderRadius: '4px',
//           },
//         },
//         {
//           id: 'email',
//           type: 'email',
//           label: 'Email',
//           placeholder: 'm@example.com',
//           required: true,
//           styles: {
//             fontSize: '16px',
//             color: '#000000',
//             padding: '8px',
//             borderRadius: '4px',
//           },
//         },
//       ],
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

//   // const addFormField = (field) => {
//   //   setContent((prev) => ({
//   //     ...prev,
//   //     form: {
//   //       ...prev.form,
//   //       fields: [...prev.form.fields, field],
//   //     },
//   //   }));
//   // };

//   const addFormField = (type) => {
//     const newField = {
//       phone: {
//         id: 'phone',
//         type: 'tel',
//         label: 'Phone',
//         placeholder: 'Enter phone number',
//         required: false,
//         styles: { /* default styles */ }
//       },
//       date: {
//         id: 'date',
//         type: 'date',
//         label: 'Date',
//         placeholder: '',
//         required: false,
//         styles: { /* default styles */ }
//       }
//     }[type];

//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.some(f => f.id === newField.id) 
//           ? prev.form.fields 
//           : [...prev.form.fields, newField]
//       }
//     }));
//   };

//   const updateFormField = (fieldId, updatedField) => {
//     setContent((prev) => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.map((field) =>
//           field.id === fieldId ? updatedField : field
//         ),
//       },
//     }));
//   };

//   // const deleteFormField = (fieldId) => {
//   //   setContent((prev) => ({
//   //     ...prev,
//   //     form: {
//   //       ...prev.form,
//   //       fields: prev.form.fields.filter((field) => field.id !== fieldId),
//   //     },
//   //   }));
//   // };

//   const deleteFormField = (fieldId) => {
//     if (['name', 'email'].includes(fieldId)) return; // Prevent deleting required fields
    
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.filter(f => f.id !== fieldId)
//       }
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
//     addFormField,
//     updateFormField,
//     deleteFormField
//   };
// };

// export default useEditableContent;



// import { useState } from 'react';

// const useEditableContent = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [content, setContent] = useState({
//     logo: {
//       content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
//       styles: {
//         desktop: {
//           width: '200px',
//           height: '200px',
//           margin: '0 auto',
//         },
//         tablet: {
//           width: '150px',
//           height: '150px',
//           margin: '0 auto',
//         },
//         mobile: {
//           width: '100px',
//           height: '100px',
//           margin: '0 auto',
//         }
//       }
//     },
//     header: {
//       content: '{{referrerName}} Recommends {{businessName}}',
//       styles: {
//         desktop: {
//           fontSize: '24px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '20px 0',
//         },
//         tablet: {
//           fontSize: '20px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '15px 0',
//         },
//         mobile: {
//           fontSize: '18px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '10px 0',
//         }
//       }
//     },
//     description1: {
//       content: 'Looking to buy a car? Book a test drive with {{businessName}}',
//       styles: {
//         desktop: {
//           fontSize: '16px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '15px 0',
//         },
//         tablet: {
//           fontSize: '14px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '12px 0',
//         },
//         mobile: {
//           fontSize: '12px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '10px 0',
//         }
//       }
//     },
//     description2: {
//       content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
//       styles: {
//         desktop: {
//           fontSize: '16px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '15px 0',
//           padding: '10px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '8px',
//         },
//         tablet: {
//           fontSize: '14px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '12px 0',
//           padding: '8px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '6px',
//         },
//         mobile: {
//           fontSize: '12px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '10px 0',
//           padding: '6px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '4px',
//         }
//       }
//     },
//     form: {
//       fields: [
//         {
//           id: 'name',
//           type: 'text',
//           label: 'Name',
//           placeholder: '',
//           required: true,
//           styles: {
//             desktop: {
//               fontSize: '16px',
//               padding: '10px',
//               margin: '8px 0',
//             },
//             tablet: {
//               fontSize: '14px',
//               padding: '8px',
//               margin: '6px 0',
//             },
//             mobile: {
//               fontSize: '12px',
//               padding: '6px',
//               margin: '4px 0',
//             }
//           }
//         },
//         {
//           id: 'email',
//           type: 'email',
//           label: 'Email',
//           placeholder: 'm@example.com',
//           required: true,
//           styles: {
//             desktop: {
//               fontSize: '16px',
//               padding: '10px',
//               margin: '8px 0',
//             },
//             tablet: {
//               fontSize: '14px',
//               padding: '8px',
//               margin: '6px 0',
//             },
//             mobile: {
//               fontSize: '12px',
//               padding: '6px',
//               margin: '4px 0',
//             }
//           }
//         }
//       ]
//     },
//     thankYouPage: {
//       content: 'Thank you for your submission! {{businessName}} will contact you shortly.',
//       styles: {
//         desktop: {
//           fontSize: '24px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '40px 0',
//         },
//         tablet: {
//           fontSize: '20px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '30px 0',
//         },
//         mobile: {
//           fontSize: '18px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '20px 0',
//         }
//       }
//     }
//   });

//   const updateContent = (section, newContent) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         content: newContent,
//       },
//     }));
//   };

//   const updateStyles = (section, viewport, newStyles) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         styles: {
//           ...prev[section].styles,
//           [viewport]: {
//             ...prev[section].styles[viewport],
//             ...newStyles
//           }
//         }
//       },
//     }));
//   };

//   const addFormField = (type) => {
//     const newField = {
//       phone: {
//         id: 'phone',
//         type: 'tel',
//         label: 'Phone',
//         placeholder: 'Enter phone number',
//         required: false,
//         styles: {
//           desktop: { fontSize: '16px', padding: '10px', margin: '8px 0' },
//           tablet: { fontSize: '14px', padding: '8px', margin: '6px 0' },
//           mobile: { fontSize: '12px', padding: '6px', margin: '4px 0' }
//         }
//       },
//       date: {
//         id: 'date',
//         type: 'date',
//         label: 'Date',
//         placeholder: '',
//         required: false,
//         styles: {
//           desktop: { fontSize: '16px', padding: '10px', margin: '8px 0' },
//           tablet: { fontSize: '14px', padding: '8px', margin: '6px 0' },
//           mobile: { fontSize: '12px', padding: '6px', margin: '4px 0' }
//         }
//       }
//     }[type];

//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.some(f => f.id === newField.id) 
//           ? prev.form.fields 
//           : [...prev.form.fields, newField]
//       }
//     }));
//   };

//   const updateFormField = (fieldId, viewport, updatedStyles) => {
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.map(field => 
//           field.id === fieldId 
//             ? { 
//                 ...field, 
//                 styles: { 
//                   ...field.styles, 
//                   [viewport]: { 
//                     ...field.styles[viewport], 
//                     ...updatedStyles 
//                   } 
//                 } 
//               } 
//             : field
//         )
//       }
//     }));
//   };

//   const deleteFormField = (fieldId) => {
//     if (['name', 'email'].includes(fieldId)) return;
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.filter(f => f.id !== fieldId)
//       }
//     }));
//   };

//   const getContentAsJSON = () => JSON.stringify(content);

//   return {
//     content,
//     currentStep,
//     setCurrentStep,
//     updateContent,
//     updateStyles,
//     setContent,
//     addFormField,
//     updateFormField,
//     deleteFormField,
//     getContentAsJSON
//   };
// };

// export default useEditableContent;

// import { useState } from 'react';

// const useEditableContent = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [content, setContent] = useState({
//     background: {
//       color: '#fffff',
//       image: 'https://images.pexels.com/photos/1590549/pexels-photo-1590549.jpeg',
//       repeat: 'no-repeat',
//       size: 'cover',
//       position: 'center',
//       styles: {
//         desktop: { opacity: '100%' },
//         tablet: { opacity: '100%' },
//         mobile: { opacity: '100%' }
//       }
//     },
//     logo: {
//       content: 'https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg',
//       styles: {
//         desktop: {
//           width: '200px',
//           height: '200px',
//           margin: '0 auto',
//         },
//         tablet: {
//           width: '150px',
//           height: '150px',
//           margin: '0 auto',
//         },
//         mobile: {
//           width: '100px',
//           height: '100px',
//           margin: '0 auto',
//         }
//       }
//     },
//     header: {
//       content: '{{referrerName}} Recommends {{businessName}}',
//       styles: {
//         desktop: {
//           fontSize: '24px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '20px 0',
//         },
//         tablet: {
//           fontSize: '20px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '15px 0',
//         },
//         mobile: {
//           fontSize: '18px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '10px 0',
//         }
//       }
//     },
//     description1: {
//       content: 'Looking to buy a car? Book a test drive with {{businessName}}',
//       styles: {
//         desktop: {
//           fontSize: '16px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '15px 0',
//         },
//         tablet: {
//           fontSize: '14px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '12px 0',
//         },
//         mobile: {
//           fontSize: '12px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '10px 0',
//         }
//       }
//     },
//     description2: {
//       content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
//       styles: {
//         desktop: {
//           fontSize: '16px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '15px 0',
//           padding: '10px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '8px',
//         },
//         tablet: {
//           fontSize: '14px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '12px 0',
//           padding: '8px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '6px',
//         },
//         mobile: {
//           fontSize: '12px',
//           color: '#333333',
//           textAlign: 'center',
//           margin: '10px 0',
//           padding: '6px',
//           backgroundColor: '#f8f8f8',
//           borderRadius: '4px',
//         }
//       }
//     },
//     form: {
//       fields: [
//         {
//           id: 'name',
//           type: 'text',
//           label: 'Name',
//           placeholder: '',
//           required: true,
//           styles: {
//             desktop: {
//               fontSize: '16px',
//               padding: '10px',
//               margin: '8px 0',
//               width: '100%',
//               height: '40px'
//             },
//             tablet: {
//               fontSize: '14px',
//               padding: '8px',
//               margin: '6px 0',
//               width: '100%',
//               height: '36px'
//             },
//             mobile: {
//               fontSize: '12px',
//               padding: '6px',
//               margin: '4px 0',
//               width: '100%',
//               height: '32px'
//             }
//           }
//         },
//         {
//           id: 'email',
//           type: 'email',
//           label: 'Email',
//           placeholder: 'm@example.com',
//           required: true,
//           styles: {
//             desktop: {
//               fontSize: '16px',
//               padding: '10px',
//               margin: '8px 0',
//               width: '100%',
//               height: '40px'
//             },
//             tablet: {
//               fontSize: '14px',
//               padding: '8px',
//               margin: '6px 0',
//               width: '100%',
//               height: '36px'
//             },
//             mobile: {
//               fontSize: '12px',
//               padding: '6px',
//               margin: '4px 0',
//               width: '100%',
//               height: '32px'
//             }
//           }
//         }
//       ]
//     },
//     thankYouPage: {
//       content: 'Thank you for your submission! {{businessName}} will contact you shortly.',
//       styles: {
//         desktop: {
//           fontSize: '24px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '40px 0',
//         },
//         tablet: {
//           fontSize: '20px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '30px 0',
//         },
//         mobile: {
//           fontSize: '18px',
//           color: '#000000',
//           textAlign: 'center',
//           margin: '20px 0',
//         }
//       },
//       background: {
//         color: '#ffffff',
//         image: 'https://images.pexels.com/photos/1590549/pexels-photo-1590549.jpeg',
//         repeat: 'no-repeat',
//         size: 'cover',
//         position: 'center',
//         styles: {
//           desktop: { opacity: '100%' },
//           tablet: { opacity: '100%' },
//           mobile: { opacity: '100%' }
//         }
//       }
//     }
//   });

//   const updateContent = (section, newContent) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         content: newContent,
//       },
//     }));
//   };

//   const updateStyles = (section, viewport, newStyles) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         styles: {
//           ...prev[section].styles,
//           [viewport]: {
//             ...prev[section].styles[viewport],
//             ...newStyles
//           }
//         }
//       },
//     }));
//   };

//   const updateBackground = (page, property, value) => {
//     setContent(prev => ({
//       ...prev,
//       [page]: {
//         ...prev[page],
//         background: {
//           ...prev[page].background,
//           [property]: value
//         }
//       }
//     }));
//   };

//   const updateBackgroundStyles = (page, viewport, newStyles) => {
//     setContent(prev => ({
//       ...prev,
//       [page]: {
//         ...prev[page],
//         background: {
//           ...prev[page].background,
//           styles: {
//             ...prev[page].background.styles,
//             [viewport]: {
//               ...prev[page].background.styles[viewport],
//               ...newStyles
//             }
//           }
//         }
//       }
//     }));
//   };

//   const addFormField = (type) => {
//     const newField = {
//       phone: {
//         id: 'phone',
//         type: 'tel',
//         label: 'Phone',
//         placeholder: 'Enter phone number',
//         required: false,
//         styles: {
//           desktop: { 
//             fontSize: '16px', 
//             padding: '10px', 
//             margin: '8px 0',
//             width: '100%',
//             height: '40px'
//           },
//           tablet: { 
//             fontSize: '14px', 
//             padding: '8px', 
//             margin: '6px 0',
//             width: '100%',
//             height: '36px'
//           },
//           mobile: { 
//             fontSize: '12px', 
//             padding: '6px', 
//             margin: '4px 0',
//             width: '100%',
//             height: '32px'
//           }
//         }
//       },
//       date: {
//         id: 'date',
//         type: 'date',
//         label: 'Date',
//         placeholder: '',
//         required: false,
//         styles: {
//           desktop: { 
//             fontSize: '16px', 
//             padding: '10px', 
//             margin: '8px 0',
//             width: '100%',
//             height: '40px'
//           },
//           tablet: { 
//             fontSize: '14px', 
//             padding: '8px', 
//             margin: '6px 0',
//             width: '100%',
//             height: '36px'
//           },
//           mobile: { 
//             fontSize: '12px', 
//             padding: '6px', 
//             margin: '4px 0',
//             width: '100%',
//             height: '32px'
//           }
//         }
//       }
//     }[type];

//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.some(f => f.id === newField.id) 
//           ? prev.form.fields 
//           : [...prev.form.fields, newField]
//       }
//     }));
//   };

//   const updateFormField = (fieldId, viewport, updatedField) => {
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.map(field => 
//           field.id === fieldId 
//             ? { 
//                 ...field, 
//                 styles: { 
//                   ...field.styles, 
//                   [viewport]: { 
//                     ...field.styles[viewport], 
//                     ...updatedField 
//                   } 
//                 } 
//               } 
//             : field
//         )
//       }
//     }));
//   };

//   const deleteFormField = (fieldId) => {
//     if (['name', 'email'].includes(fieldId)) return;
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.filter(f => f.id !== fieldId)
//       }
//     }));
//   };

//   const getContentAsJSON = () => JSON.stringify(content);

//   return {
//     content,
//     currentStep,
//     setCurrentStep,
//     updateContent,
//     updateStyles,
//     updateBackground,
//     updateBackgroundStyles,
//     setContent,
//     addFormField,
//     updateFormField,
//     deleteFormField,
//     getContentAsJSON
//   };
// };

// export default useEditableContent;



// import { useState } from 'react';

// const useEditableContent = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [content, setContent] = useState({
//     background: {
//       color: '#ffffff',
//       image: '',
//       repeat: 'no-repeat',
//       size: 'cover',
//       position: 'center',
//       styles: {
//         desktop: { opacity: '100%' },
//         tablet: { opacity: '100%' },
//         mobile: { opacity: '100%' }
//       }
//     },
//     logo: {
//       content: '',
//       styles: {
//         desktop: { width: '200px', height: '200px', margin: '0 auto' },
//         tablet: { width: '150px', height: '150px', margin: '0 auto' },
//         mobile: { width: '100px', height: '100px', margin: '0 auto' }
//       }
//     },
//     header: {
//       content: '{{referrerName}} Recommends {{businessName}}',
//       styles: {
//         desktop: { fontSize: '24px', color: '#000000', textAlign: 'center', margin: '20px 0' },
//         tablet: { fontSize: '20px', color: '#000000', textAlign: 'center', margin: '15px 0' },
//         mobile: { fontSize: '18px', color: '#000000', textAlign: 'center', margin: '10px 0' }
//       }
//     },
//     description1: {
//       content: 'Looking to buy a car? Book a test drive with {{businessName}}',
//       styles: {
//         desktop: { fontSize: '16px', color: '#333333', textAlign: 'center', margin: '15px 0' },
//         tablet: { fontSize: '14px', color: '#333333', textAlign: 'center', margin: '12px 0' },
//         mobile: { fontSize: '12px', color: '#333333', textAlign: 'center', margin: '10px 0' }
//       }
//     },
//     description2: {
//       content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
//       styles: {
//         desktop: { fontSize: '16px', color: '#333333', textAlign: 'center', margin: '15px 0', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '8px' },
//         tablet: { fontSize: '14px', color: '#333333', textAlign: 'center', margin: '12px 0', padding: '8px', backgroundColor: '#f8f8f8', borderRadius: '6px' },
//         mobile: { fontSize: '12px', color: '#333333', textAlign: 'center', margin: '10px 0', padding: '6px', backgroundColor: '#f8f8f8', borderRadius: '4px' }
//       }
//     },
//     form: {
//       fields: [
//         {
//           id: 'name',
//           type: 'text',
//           label: 'Name',
//           placeholder: '',
//           required: true,
//           styles: {
//             desktop: { fontSize: '16px', padding: '10px', margin: '8px 0', width: '100%', height: '40px' },
//             tablet: { fontSize: '14px', padding: '8px', margin: '6px 0', width: '100%', height: '36px' },
//             mobile: { fontSize: '12px', padding: '6px', margin: '4px 0', width: '100%', height: '32px' }
//           }
//         },
//         {
//           id: 'email',
//           type: 'email',
//           label: 'Email',
//           placeholder: 'm@example.com',
//           required: true,
//           styles: {
//             desktop: { fontSize: '16px', padding: '10px', margin: '8px 0', width: '100%', height: '40px' },
//             tablet: { fontSize: '14px', padding: '8px', margin: '6px 0', width: '100%', height: '36px' },
//             mobile: { fontSize: '12px', padding: '6px', margin: '4px 0', width: '100%', height: '32px' }
//           }
//         }
//       ]
//     },
//     thankYouPage: {
//       content: 'Thank you for your submission! {{businessName}} will contact you shortly.',
//       styles: {
//         desktop: { fontSize: '24px', color: '#000000', textAlign: 'center', margin: '40px 0' },
//         tablet: { fontSize: '20px', color: '#000000', textAlign: 'center', margin: '30px 0' },
//         mobile: { fontSize: '18px', color: '#000000', textAlign: 'center', margin: '20px 0' }
//       },
//       background: {
//         color: '#ffffff',
//         image: '',
//         repeat: 'no-repeat',
//         size: 'cover',
//         position: 'center',
//         styles: {
//           desktop: { opacity: '100%' },
//           tablet: { opacity: '100%' },
//           mobile: { opacity: '100%' }
//         }
//       }
//     }
//   });

//   // Update functions...
//   const updateContent = (section, newContent) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         content: newContent,
//       },
//     }));
//   };

//   const updateStyles = (section, viewport, newStyles) => {
//     setContent(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         styles: {
//           ...prev[section].styles,
//           [viewport]: {
//             ...prev[section].styles[viewport],
//             ...newStyles
//           }
//         }
//       },
//     }));
//   };

//   const updateBackground = (page, property, value) => {
//     setContent(prev => ({
//       ...prev,
//       [page]: {
//         ...prev[page],
//         background: {
//           ...prev[page].background,
//           [property]: value
//         }
//       }
//     }));
//   };

//   const updateBackgroundStyles = (page, viewport, newStyles) => {
//     setContent(prev => ({
//       ...prev,
//       [page]: {
//         ...prev[page],
//         background: {
//           ...prev[page].background,
//           styles: {
//             ...prev[page].background.styles,
//             [viewport]: {
//               ...prev[page].background.styles[viewport],
//               ...newStyles
//             }
//           }
//         }
//       }
//     }));
//   };

//   const addFormField = (type) => {
//     const newField = {
//       phone: {
//         id: 'phone',
//         type: 'tel',
//         label: 'Phone',
//         placeholder: 'Enter phone number',
//         required: false,
//         styles: {
//           desktop: { fontSize: '16px', padding: '10px', margin: '8px 0', width: '100%', height: '40px' },
//           tablet: { fontSize: '14px', padding: '8px', margin: '6px 0', width: '100%', height: '36px' },
//           mobile: { fontSize: '12px', padding: '6px', margin: '4px 0', width: '100%', height: '32px' }
//         }
//       },
//       date: {
//         id: 'date',
//         type: 'date',
//         label: 'Date',
//         placeholder: '',
//         required: false,
//         styles: {
//           desktop: { fontSize: '16px', padding: '10px', margin: '8px 0', width: '100%', height: '40px' },
//           tablet: { fontSize: '14px', padding: '8px', margin: '6px 0', width: '100%', height: '36px' },
//           mobile: { fontSize: '12px', padding: '6px', margin: '4px 0', width: '100%', height: '32px' }
//         }
//       }
//     }[type];

//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.some(f => f.id === newField.id) 
//           ? prev.form.fields 
//           : [...prev.form.fields, newField]
//       }
//     }));
//   };

//   const updateFormField = (fieldId, viewport, updatedField) => {
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.map(field => 
//           field.id === fieldId 
//             ? { 
//                 ...field, 
//                 styles: { 
//                   ...field.styles, 
//                   [viewport]: { 
//                     ...field.styles[viewport], 
//                     ...updatedField 
//                   } 
//                 } 
//               } 
//             : field
//         )
//       }
//     }));
//   };

//   const deleteFormField = (fieldId) => {
//     if (['name', 'email'].includes(fieldId)) return;
//     setContent(prev => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         fields: prev.form.fields.filter(f => f.id !== fieldId)
//       }
//     }));
//   };

//   const getContentAsJSON = () => JSON.stringify(content);

//   return {
//     content,
//     currentStep,
//     setCurrentStep,
//     updateContent,
//     updateStyles,
//     updateBackground,
//     updateBackgroundStyles,
//     setContent,
//     addFormField,
//     updateFormField,
//     deleteFormField,
//     getContentAsJSON
//   };
// };

// export default useEditableContent;


import { useState } from 'react';

const useEditableContent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [content, setContent] = useState({
    background: {
      color: '#ffffff',
      image: '',
      repeat: 'no-repeat',
      size: 'cover',
      position: 'center',
      styles: {
        desktop: { opacity: '100%' },
        tablet: { opacity: '100%' },
        mobile: { opacity: '100%' }
      }
    },
    logo: {
      content: '',
      styles: {
        desktop: { 
          width: '200px', 
          height: '200px', 
          margin: '0 auto',
          display: 'block' 
        },
        tablet: { 
          width: '150px', 
          height: '150px', 
          margin: '0 auto',
          display: 'block' 
        },
        mobile: { 
          width: '100px', 
          height: '100px', 
          margin: '0 auto',
          display: 'block' 
        }
      }
    },
    header: {
      content: '{{referrerName}} Recommends {{businessName}}',
      styles: {
        desktop: { 
          fontSize: '24px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '20px auto',
          width: '100%',
          maxWidth: '800px'
        },
        tablet: { 
          fontSize: '20px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '15px auto',
          width: '100%',
          maxWidth: '600px'
        },
        mobile: { 
          fontSize: '18px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px'
        }
      }
    },
    description1: {
      content: 'Looking to buy a car? Book a test drive with {{businessName}}',
      styles: {
        desktop: { 
          fontSize: '16px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '15px auto',
          width: '100%',
          maxWidth: '800px'
        },
        tablet: { 
          fontSize: '14px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '12px auto',
          width: '100%',
          maxWidth: '600px'
        },
        mobile: { 
          fontSize: '12px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px'
        }
      }
    },
    description2: {
      content: "Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.",
      styles: {
        desktop: { 
          fontSize: '16px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '15px auto',
          padding: '10px', 
          backgroundColor: '#f8f8f8', 
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px'
        },
        tablet: { 
          fontSize: '14px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '12px auto',
          padding: '8px', 
          backgroundColor: '#f8f8f8', 
          borderRadius: '6px',
          width: '100%',
          maxWidth: '600px'
        },
        mobile: { 
          fontSize: '12px', 
          color: '#333333', 
          textAlign: 'center', 
          margin: '10px auto',
          padding: '6px', 
          backgroundColor: '#f8f8f8', 
          borderRadius: '4px',
          width: '100%',
          maxWidth: '300px'
        }
      }
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
            desktop: { 
              fontSize: '16px', 
              padding: '10px', 
              margin: '8px auto',
              width: '100%', 
              height: '40px',
              maxWidth: '500px'
            },
            tablet: { 
              fontSize: '14px', 
              padding: '8px', 
              margin: '6px auto',
              width: '100%', 
              height: '36px',
              maxWidth: '400px'
            },
            mobile: { 
              fontSize: '12px', 
              padding: '6px', 
              margin: '4px auto',
              width: '100%', 
              height: '32px',
              maxWidth: '300px'
            }
          }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'm@example.com',
          required: true,
          styles: {
            desktop: { 
              fontSize: '16px', 
              padding: '10px', 
              margin: '8px auto',
              width: '100%', 
              height: '40px',
              maxWidth: '500px'
            },
            tablet: { 
              fontSize: '14px', 
              padding: '8px', 
              margin: '6px auto',
              width: '100%', 
              height: '36px',
              maxWidth: '400px'
            },
            mobile: { 
              fontSize: '12px', 
              padding: '6px', 
              margin: '4px auto',
              width: '100%', 
              height: '32px',
              maxWidth: '300px'
            }
          }
        }
      ]
    },
    thankYouPage: {
      content: 'Thank you for your submission! {{businessName}} will contact you shortly.',
      styles: {
        desktop: { 
          fontSize: '24px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '40px auto',
          width: '100%',
          maxWidth: '800px'
        },
        tablet: { 
          fontSize: '20px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '30px auto',
          width: '100%',
          maxWidth: '600px'
        },
        mobile: { 
          fontSize: '18px', 
          color: '#000000', 
          textAlign: 'center', 
          margin: '20px auto',
          width: '100%',
          maxWidth: '300px'
        }
      },
      background: {
        color: '#ffffff',
        image: '',
        repeat: 'no-repeat',
        size: 'cover',
        position: 'center',
        styles: {
          desktop: { opacity: '100%' },
          tablet: { opacity: '100%' },
          mobile: { opacity: '100%' }
        }
      }
    }
  });

  const updateContent = (section, newContent) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        content: newContent,
      },
    }));
  };

  const updateStyles = (section, viewport, newStyles) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        styles: {
          ...prev[section].styles,
          [viewport]: {
            ...prev[section].styles[viewport],
            ...newStyles
          }
        }
      },
    }));
  };

  const updateBackground = (page, property, value) => {
    setContent(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        background: {
          ...prev[page].background,
          [property]: value
        }
      }
    }));
  };

  const updateBackgroundStyles = (page, viewport, newStyles) => {
    setContent(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        background: {
          ...prev[page].background,
          styles: {
            ...prev[page].background.styles,
            [viewport]: {
              ...prev[page].background.styles[viewport],
              ...newStyles
            }
          }
        }
      }
    }));
  };

  const addFormField = (type) => {
    const newField = {
      phone: {
        id: 'phone',
        type: 'tel',
        label: 'Phone',
        placeholder: 'Enter phone number',
        required: false,
        styles: {
          desktop: { 
            fontSize: '16px', 
            padding: '10px', 
            margin: '8px auto',
            width: '100%', 
            height: '40px',
            maxWidth: '500px'
          },
          tablet: { 
            fontSize: '14px', 
            padding: '8px', 
            margin: '6px auto',
            width: '100%', 
            height: '36px',
            maxWidth: '400px'
          },
          mobile: { 
            fontSize: '12px', 
            padding: '6px', 
            margin: '4px auto',
            width: '100%', 
            height: '32px',
            maxWidth: '300px'
          }
        }
      },
      date: {
        id: 'date',
        type: 'date',
        label: 'Date',
        placeholder: '',
        required: false,
        styles: {
          desktop: { 
            fontSize: '16px', 
            padding: '10px', 
            margin: '8px auto',
            width: '100%', 
            height: '40px',
            maxWidth: '500px'
          },
          tablet: { 
            fontSize: '14px', 
            padding: '8px', 
            margin: '6px auto',
            width: '100%', 
            height: '36px',
            maxWidth: '400px'
          },
          mobile: { 
            fontSize: '12px', 
            padding: '6px', 
            margin: '4px auto',
            width: '100%', 
            height: '32px',
            maxWidth: '300px'
          }
        }
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

  const updateFormField = (fieldId, viewport, updatedField) => {
    setContent(prev => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.map(field => 
          field.id === fieldId 
            ? { 
                ...field, 
                styles: { 
                  ...field.styles, 
                  [viewport]: { 
                    ...field.styles[viewport], 
                    ...updatedField 
                  } 
                } 
              } 
            : field
        )
      }
    }));
  };

  const deleteFormField = (fieldId) => {
    if (['name', 'email'].includes(fieldId)) return;
    setContent(prev => ({
      ...prev,
      form: {
        ...prev.form,
        fields: prev.form.fields.filter(f => f.id !== fieldId)
      }
    }));
  };

  const getContentAsJSON = () => JSON.stringify(content);

  return {
    content,
    currentStep,
    setCurrentStep,
    updateContent,
    updateStyles,
    updateBackground,
    updateBackgroundStyles,
    setContent,
    addFormField,
    updateFormField,
    deleteFormField,
    getContentAsJSON
  };
};

export default useEditableContent;