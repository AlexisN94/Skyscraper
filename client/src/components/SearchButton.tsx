import React, { ComponentProps, FC, useEffect, useState } from 'react';
import tailwindConfig from 'tailwind.config';

type Props = {
   searching: boolean;
} & ComponentProps<'button'>;

const SearchButton: FC<Props> = ({ searching, ...buttonProps }) => {
   const [text, setText] = useState('');
   const [style, setStyle] = useState({
      backgroundColor: tailwindConfig.theme.extend.colors['blue'],
      color: 'white',
   });

   useEffect(() => {
      if (searching) {
         setText('Stop search');
         setStyle({
            backgroundColor: tailwindConfig.theme.extend.colors['yellow'],
            color: tailwindConfig.theme.extend.colors['dark-blue'],
         });
      } else {
         setText('Search flights');
         setStyle({
            backgroundColor: tailwindConfig.theme.extend.colors['blue'],
            color: 'white',
         });
      }
   }, [searching]);

   return (
      <button {...buttonProps} style={style}>
         {text}
      </button>
   );
};

export default SearchButton;
