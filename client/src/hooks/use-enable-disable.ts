import { useState } from 'react';

export type EnableDisableHandler = {
   isEnabled: boolean;
   willEnable: boolean;
   willDisable: boolean;
   enable: () => void;
   delayEnable: () => void;
   disable: () => void;
   delayDisable: () => void;
   toggle: () => void;
   delayToggle: () => void;
};

const useEnableDisable = (defaultValue = false) => {
   const [willEnable, setWillEnable] = useState(false);
   const [willDisable, setWillDisable] = useState(false);
   const [isEnabled, setIsEnabled] = useState(defaultValue);

   const enable = () => {
      setIsEnabled(true);
      setWillEnable(false);
   };

   const disable = () => {
      setIsEnabled(false);
      setWillDisable(false);
   };

   const toggle = () => {
      setIsEnabled((state) => !state);
   };

   const delayEnable = (delay = 250) => {
      setWillEnable(true);
      setTimeout(() => {
         enable();
      }, delay);
   };

   const delayDisable = (delay = 250) => {
      setWillDisable(true);
      setTimeout(() => {
         disable();
      }, delay);
   };

   const delayToggle = (delay = 250) => {
      if (isEnabled) setWillDisable(true);
      else setWillEnable(true);
      setTimeout(() => {
         if (isEnabled) setWillDisable(false);
         else setWillEnable(false);
         toggle();
      }, delay);
   };

   return {
      isEnabled,
      willEnable,
      willDisable,
      enable,
      delayEnable,
      disable,
      delayDisable,
      toggle,
      delayToggle,
   };
};

export default useEnableDisable;
