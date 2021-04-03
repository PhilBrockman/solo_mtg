import React from 'react'

export default function useCardKeyTap(targetKey, condition, callback) {
  React.useEffect(() => {
    function downHandler({ key }) {
      if (condition && key === targetKey) {
        callback();
      }
    }

    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);

  return null;
}

//https://usehooks.com/useKeyPress/
// import React, {useState, useEffect} from 'react'

// // Hook
// export function useKeyPress(targetKey) {
//   // State for keeping track of whether key is pressed
//   const [keyPressed, setKeyPressed] = useState(false);

//   // If pressed key is our target key then set to true
//   function downHandler({ key }) {
//     if (key === targetKey) {
//       setKeyPressed(true);
//     }
//   }

//   // If released key is our target key then set to false
//   const upHandler = ({ key }) => {
//     if (key === targetKey) {
//       setKeyPressed(false);
//     }
//   };

//   // Add event listeners
//   useEffect(() => {
//     window.addEventListener('keydown', downHandler);
//     window.addEventListener('keyup', upHandler);
//     // Remove event listeners on cleanup
//     return () => {
//       window.removeEventListener('keydown', downHandler);
//       window.removeEventListener('keyup', upHandler);
//     };
//   }, []); // Empty array ensures that effect is only run on mount and unmount

//   return keyPressed;
// }