import React, { ChangeEvent, FC } from 'react';

import './style.css';

export type FormFieldProps = {
   label: string;
   append?: JSX.Element;
   renderBelow?: JSX.Element;
   onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
} & React.HTMLProps<HTMLInputElement>;

const FormField: FC<FormFieldProps> = ({ label, append, renderBelow, onChange, ...props }) => {
   const { className, ...inputProps } = props;
   return (
      <div className={className}>
         <span className="text-xs">{label}</span>
         <div className="text-dark-blue flex bg-white border-r-gray-700 border-[1px]">
            <input
               {...inputProps}
               onFocus={(ev) => ev.target.select()}
               className="h-8 pl-2 w-full"
               onChange={onChange}
            />
            {append}
         </div>
         {renderBelow}
      </div>
   );
};

export default FormField;
