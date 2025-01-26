// import React, { useEffect, useRef, useState } from 'react';

import { useEffect, useRef, useState } from "react";

// const EditableText = ({ value, onChange, renderContent, placeholder, className, styles }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [text, setText] = useState(value);
//   const editableRef = useRef(null);

//   const handleBlur = () => {
//     setIsEditing(false);
//     onChange(text);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (editableRef.current && !editableRef.current.contains(event.target)) {
//         setIsEditing(false);
//         onChange(text);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [text, onChange]);

//   return (
//     <>
//       {isEditing ? (
//         <div
//           ref={editableRef}
//           contentEditable
//           onBlur={handleBlur}
//           onInput={(e) => setText(e.target.textContent)}
//           suppressContentEditableWarning={true}
//           className={`${className} cursor-text border-b border-dashed border-gray-400`}
//           style={{
//             backgroundColor: styles.backgroundColor,
//             fontSize: styles.fontSize,
//             fontFamily: styles.fontFamily,
//             color: styles.color,
//             padding: styles.padding,
//             borderRadius: styles.borderRadius,
//           }}
//         >
//           {text}
//         </div>
//       ) : (
//         <div
//           onClick={() => setIsEditing(true)}
//           className={`${className} cursor-pointer`}
//           style={{
//             backgroundColor: styles.backgroundColor,
//             fontSize: styles.fontSize,
//             fontFamily: styles.fontFamily,
//             color: styles.color,
//             padding: styles.padding,
//             borderRadius: styles.borderRadius,
//           }}
//         >
//           {renderContent(text)}
//         </div>
//       )}
//     </>
//   );
// };

// export default EditableText;


const EditableText = ({ value, onChange, renderContent, className, styles, elementName, setSelectedElement }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const editableRef = useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(text);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editableRef.current && !editableRef.current.contains(event.target)) {
        setIsEditing(false);
        onChange(text);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text, onChange]);

  return (
    <>
      {isEditing ? (
        <div
          ref={editableRef}
          contentEditable
          onBlur={handleBlur}
          onInput={(e) => setText(e.target.textContent)}
          suppressContentEditableWarning={true}
          className={`${className} cursor-text border-b border-dashed border-gray-400`}
          style={styles}
        >
          {text}
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditing(true);
            setSelectedElement(elementName); // Set the selected element
          }}
          className={`${className} cursor-pointer`}
          style={styles}
        >
          {renderContent(text)}
        </div>
      )}
    </>
  );
};

export default EditableText;