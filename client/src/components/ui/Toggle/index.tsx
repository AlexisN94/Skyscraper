import CSS from 'csstype';
import React, { FC, useEffect, useRef, useState } from 'react';

type Props = {
   options: string[];
   activeStyle?: {
      color: string;
      backgroundColor: string;
   };
   inactiveStyle?: {
      color: string;
      backgroundColor: string;
   };
   sharedStyle?: {
      padding: string;
      fontWeight: string;
      fontSize: string;
   };
   borderRadius?: number;
   onChange: (index: number) => void;
   border?: string;
   defaultSelectedIndex?: number;
};

const Toggle: FC<Props> = ({
   options,
   activeStyle,
   inactiveStyle,
   onChange,
   borderRadius = 0,
   sharedStyle,
   border,
   defaultSelectedIndex = 0,
}) => {
   const [activeIndex, setActiveIndex] = useState(defaultSelectedIndex);
   const refs = useRef<HTMLDivElement[]>([]);
   const [computedStyle, setComputedStyle] = useState<CSS.Properties>();
   const [firstRender, setFirstRender] = useState(true);

   useEffect(() => {
      setFirstRender(false);
   }, []);

   const borderRadiusStyle = {
      softLeftCorners: `${borderRadius}px 0px 0px ${borderRadius}px`,
      softRightCorners: `0px ${borderRadius}px ${borderRadius}px 0px`,
   };

   useEffect(() => {
      if (!firstRender) onChange(activeIndex);
      setComputedStyle({
         width: refs.current[activeIndex].getBoundingClientRect().width + 'px',
         borderRadius:
            activeIndex === 0
               ? borderRadiusStyle.softLeftCorners
               : borderRadiusStyle.softRightCorners,
         left: activeIndex === 0 ? 0 : refs.current[0].getBoundingClientRect().width + 'px',
         boxShadow:
            activeIndex === 0
               ? '0.4px 0px 0.5px hsl(0deg 0% 63% / 0.28), 1px -0.1px 1.1px -0.6px hsl(0deg 0% 63% / 0.28), 2px -0.2px 2.3px -1.2px hsl(0deg 0% 63% / 0.28), 4px -0.3px 4.5px -1.8px hsl(0deg 0% 63% / 0.29), 7.7px -0.6px 8.7px -2.4px hsl(0deg 0% 63% / 0.29)'
               : '-0.4px 0px 0.5px hsl(0deg 0% 63% / 0.28), -1px -0.1px 1.1px -0.6px hsl(0deg 0% 63% / 0.28), -2px -0.2px 2.3px -1.2px hsl(0deg 0% 63% / 0.28), -4px -0.3px 4.5px -1.8px hsl(0deg 0% 63% / 0.29), -7.7px -0.6px 8.7px -2.4px hsl(0deg 0% 63% / 0.29)',
      });
   }, [activeIndex, activeStyle, inactiveStyle]);

   return (
      <button
         className="relative flex max-w-min"
         onClick={() => {
            setActiveIndex((state) => (state + 1) % 2);
         }}
      >
         <div
            style={{ ...activeStyle, ...sharedStyle, ...computedStyle, height: '100%' }}
            className="pointer-events-none absolute transition-all duration-300 flex items-center"
         >
            {options[activeIndex]}
         </div>

         {options.map((text, index) => (
            <div
               key={text}
               ref={(ref) => (refs.current[index] = ref)}
               className="flex items-center"
               style={{
                  ...inactiveStyle,
                  ...sharedStyle,
                  border,
                  borderRight: index === 0 ? 'none' : border,
                  borderLeft: index === 1 ? 'none' : border,
                  borderRadius:
                     index === 0
                        ? borderRadiusStyle.softLeftCorners
                        : borderRadiusStyle.softRightCorners,
               }}
            >
               {text}
            </div>
         ))}
      </button>
   );
};

export default Toggle;
