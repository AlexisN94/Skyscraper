import tailwindConfig from 'tailwind.config';

const rangeSliderStyle = {
   color: tailwindConfig.theme.extend.colors['blue'],
   '& .MuiSlider-rail': {
      height: 8,
      backgroundColor: 'white',
      opacity: 1,
   },
   '& .MuiSlider-track': { height: 8 },
   '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: '0.75rem',
      fontWeight: 'bold',
      background: 'unset',
      padding: 0,
      top: 5,
      width: 25,
      height: 25,
      borderRadius: '50% 50% 50% 0',
      transformOrigin: 'bottom left',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
         transform: 'translate(50%, -100%) rotate(135deg) scale(1)',
      },
      '& > *': {
         transform: 'rotate(225deg)',
      },
   },
   '& .MuiSlider-thumb': {
      width: 14,
      height: 14,
   },
};

export default rangeSliderStyle;
