// // useEditableContent.js
// import { useState } from 'react';

// const useEditableContent = () => {
//   // State for editable content
//   const [headerContent, setHeaderContent] = useState('{{referrerName}} Recommends {{businessName}}');
//   const [description1, setDescription1] = useState('Looking to buy a car? Book a test drive with {{businessName}}');
//   const [description2, setDescription2] = useState("Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.");

//   // State for styles
//   const [styles, setStyles] = useState({
//     backgroundColor: '#ffffff',
//     fontSize: '16px',
//     fontFamily: 'Arial, sans-serif',
//     color: '#000000',
//     padding: '0px',
//     borderRadius: '8px',
//   });

//   return {
//     headerContent,
//     setHeaderContent,
//     description1,
//     setDescription1,
//     description2,
//     setDescription2,
//     styles,
//     setStyles,
//   };
// };

// export default useEditableContent;


// useEditableContent.js
import { useState } from 'react';

const useEditableContent = () => {
  // State for editable content
  const [headerContent, setHeaderContent] = useState('{{referrerName}} Recommends {{businessName}}');
  const [description1, setDescription1] = useState('Looking to buy a car? Book a test drive with {{businessName}}');
  const [description2, setDescription2] = useState("Since you're a friend of {{referrerName}}, you get an extended warranty on your purchase for free.");

  // State for styles
  const [headerStyles, setHeaderStyles] = useState({
    backgroundColor: '#ffffff',
    fontSize: '24px', // Larger font size for header
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    padding: '16px',
    borderRadius: '8px',
  });

  const [description1Styles, setDescription1Styles] = useState({
    backgroundColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    padding: '8px',
    borderRadius: '8px',
  });

  const [description2Styles, setDescription2Styles] = useState({
    backgroundColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    padding: '8px',
    borderRadius: '8px',
  });

  return {
    headerContent,
    setHeaderContent,
    description1,
    setDescription1,
    description2,
    setDescription2,
    headerStyles,
    setHeaderStyles,
    description1Styles,
    setDescription1Styles,
    description2Styles,
    setDescription2Styles,
  };
};

export default useEditableContent;