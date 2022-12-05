export const pluralize = (value: number, unit: string) => {
   return value + ' ' + (value === 1 ? unit : unit + 's');
};
