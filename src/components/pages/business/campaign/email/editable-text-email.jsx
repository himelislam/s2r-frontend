// import { useEffect, useRef, useState } from "react";

// const EditableTextEmail = ({ value, onChange, renderContent, className, styles, elementName, setSelectedElement, isEditable }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const editableRef = useRef(null);

//     const handleBlur = () => {
//         setIsEditing(false);
//         onChange(editableRef.current.textContent);
//     };

//     useEffect(() => {
//         if (isEditing && editableRef.current) {
//             // Focus the contentEditable element and move the cursor to the end
//             editableRef.current.focus();
//             const range = document.createRange();
//             const selection = window.getSelection();
//             range.selectNodeContents(editableRef.current);
//             range.collapse(false);
//             selection.removeAllRanges();
//             selection.addRange(range);
//         }
//     }, [isEditing]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (editableRef.current && !editableRef.current.contains(event.target)) {
//                 handleBlur();
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [handleBlur]);

//     return (
//         <>
//             {isEditing ? (
//                 <div
//                     ref={editableRef}
//                     contentEditable
//                     onBlur={handleBlur}
//                     suppressContentEditableWarning={true}
//                     className={`${className} cursor-text border-b border-dashed border-gray-400`}
//                     style={styles}
//                 >
//                     {value}
//                 </div>
//             ) : (
//                 <div
//                     onClick={() => {
//                         if (isEditable) {
//                             setIsEditing(true);
//                             setSelectedElement(elementName);
//                         }
//                     }}
//                     className={`${className} cursor-pointer`}
//                     style={styles}
//                 >
//                     {renderContent(value)}
//                 </div>
//             )}
//         </>
//     );
// };

// export default EditableTextEmail;

import { useEffect, useRef, useState } from 'react';

const EditableTextEmail = ({
  value,
  onChange,
  renderContent,
  className,
  styles,
  elementName,
  setSelectedElement,
  isEditable = true,
  placeholder = 'Click to edit...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);
  const editableRef = useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = editableRef.current.textContent.trim();
    setIsEmpty(!newValue);
    onChange(newValue);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editableRef.current && !editableRef.current.contains(event.target)) {
        handleBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleBlur]);

  return (
    <>
      {isEditing ? (
        <div
          ref={editableRef}
          contentEditable
          onBlur={handleBlur}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
          className={`${className} cursor-text border-b border-dashed border-gray-400 min-h-[20px]`}
          style={styles}
          data-placeholder={placeholder}
        >
          {value}
        </div>
      ) : (
        <div
          onClick={() => {
            if (isEditable) {
              setIsEditing(true);
              setSelectedElement(elementName);
            }
          }}
          className={`${className} ${isEditable ? 'cursor-pointer' : 'cursor-default'} ${
            isEmpty ? 'text-gray-400' : ''
          }`}
          style={styles}
        >
          {isEmpty ? placeholder : renderContent(value)}
        </div>
      )}
    </>
  );
};

export default EditableTextEmail;