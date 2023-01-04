import { Slider, SliderProps } from '@mui/material';
import React from 'react';
import { pluralize } from 'utils/string';

export type RangeSliderProps = {
   title: string;
   subtitle: string;
   showSubtitle: boolean;
   unit?: string;
   className?: string;
} & SliderProps;

const RangeSlider = ({
   title,
   className = '',
   showSubtitle,
   visible,
   unit,
   value,
   ...sliderProps
}) => {
   return (
      <label className={className} style={{ display: visible ? 'inline' : 'none' }}>
         <div className="whitespace-nowrap">
            {title}
            {showSubtitle && (
               <span className="ml-2 text-gray-400 text-xs font-medium whitespace-nowrap">
                  {value[0] === value[1]
                     ? `${pluralize(value[0], unit)}`
                     : `At least ${pluralize(value[0], unit)}, at most ${pluralize(
                          value[1],
                          unit
                       )}`}
               </span>
            )}
         </div>
         <div className="flex items-center align-middle self-center gap-3 w-full">
            <Slider value={value} {...sliderProps} />
         </div>
      </label>
   );
};

export default RangeSlider;
