import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from 'components/ui/Toggle';

describe('Toggle', () => {
   const options = ['Normal', 'Compact'];
   const onChange = jest.fn();
   const activeStyle = { color: 'white', backgroundColor: 'blue' };
   const inactiveStyle = { color: 'blue', backgroundColor: 'white' };

   beforeEach(() => {
      render(
         <Toggle
            options={options}
            activeStyle={activeStyle}
            inactiveStyle={inactiveStyle}
            onChange={onChange}
         />
      );
   });

   it('renders all options', () => {
      expect(screen.getAllByText(options[0]).length).toBe(2);
      expect(screen.getByText(options[1])).toBeInTheDocument();
   });

   it("doesn't call onSelect() on first render", () => {
      expect(onChange).not.toBeCalled();
   });

   it('sets option active on click', async () => {
      const secondOption = screen.getByText(options[1]);
      userEvent.click(secondOption);
      await waitFor(() => {
         expect(screen.getAllByText(options[1]).length).toBe(2);
      });
   });

   it('calls onChange on click', async () => {
      const firstOption = screen.getAllByText(options[0])[1];
      userEvent.click(firstOption);
      await waitFor(() => {
         expect(onChange).toBeCalledWith(1);
         expect(onChange).not.toBeCalledWith(0);
      });
      userEvent.click(firstOption);
      await waitFor(() => {
         expect(onChange).toBeCalledWith(0);
      });
   });
});
