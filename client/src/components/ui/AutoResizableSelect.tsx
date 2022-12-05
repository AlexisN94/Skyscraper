import React, { ComponentProps, FC, useEffect, useRef } from 'react';

const AutoResizableSelect: FC<ComponentProps<'select'>> = ({
   children,
   className,
   style,
   ...props
}) => {
   const original = useRef<HTMLSelectElement>(null);
   const helper = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (helper.current?.textContent)
         original.current.style.width = helper.current.offsetWidth + 'px';
   }, [original.current?.value, children, className, style, props]);

   return (
      <>
         <select
            role="combobox"
            ref={original}
            {...props}
            className={className}
            style={{ ...style }}
         >
            {children}
         </select>
         <div ref={helper} className={className + ' helper-element'} style={{ ...style }}>
            {original.current?.options[original.current?.selectedIndex].text}
         </div>
      </>
   );
};

export default AutoResizableSelect;
