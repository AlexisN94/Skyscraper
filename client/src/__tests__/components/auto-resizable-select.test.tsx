import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import AutoResizableSelect from 'components/ui/AutoResizableSelect';

describe('AutoResizableSelect', () => {
   it('renders children properly', () => {
      render(
         <AutoResizableSelect>
            <option value="value1">Option1</option>
            <option value="value2">Option2</option>
         </AutoResizableSelect>
      );

      expect(screen.getByText('Option2')).toBeInTheDocument();
   });
});
