import React, { ComponentPropsWithRef, FC, useEffect, useRef, useState } from 'react';

const WidthAwareDiv: FC<ComponentPropsWithRef<'div'>> = ({ children, ...props }) => {
   const ref = useRef<HTMLDivElement>(null);
   const auxRef = useRef<HTMLDivElement>(null);
   const [width, setWidth] = useState<number>(undefined);

   useEffect(() => {
      if (auxRef.current) {
         setWidth(auxRef.current.scrollWidth);
      }
   }, [children, auxRef, props]);

   return (
      <>
         <div {...props} ref={ref} style={{ ...props.style, width }}>
            {children}
         </div>
         <div
            {...props}
            ref={auxRef}
            style={{
               ...props.style,
               transform: 'translate(-100%)',
               top: '0px',
               left: '0px',
               position: 'fixed',
            }}
         >
            {children}
         </div>
      </>
   );
};

export default WidthAwareDiv;
