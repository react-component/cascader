import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import type { AllowClearConfig } from '@rc-component/util';
import Cascader from '../src';

describe.each([false, true])('allowClear checkable=%s', checkable => {
  it('passes the complete configuration to Select and preserves clear callbacks', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    const props = { options: [{ value: 'one', label: 'One' }], onChange, onClear };
    const renderCascader = (allowClear: boolean | AllowClearConfig) =>
      checkable ? (
        <Cascader {...props} checkable defaultValue={[['one']]} allowClear={allowClear} />
      ) : (
        <Cascader {...props} defaultValue={['one']} allowClear={allowClear} />
      );
    const config = { clearIcon: 'custom', label: 'Erase', tabIndex: -1 };
    const { container, getByRole, queryByRole, rerender } = render(renderCascader(false));
    const markup = container.innerHTML;
    rerender(renderCascader({ ...config, disabled: true }));
    expect(container.innerHTML).toBe(markup);
    expect(queryByRole('button', { name: 'Erase' })).toBeNull();
    expect(onClear).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    rerender(renderCascader(config));
    const button = getByRole('button', { name: 'Erase' });
    expect(button.tabIndex).toBe(-1);
    expect(button).toHaveTextContent('custom');
    rerender(renderCascader({ ...config, tabIndex: 0 }));
    expect(getByRole('button', { name: 'Erase' }).tabIndex).toBe(0);
    fireEvent.click(getByRole('button', { name: 'Erase' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(checkable ? [] : undefined);
    expect(queryByRole('button', { name: 'Erase' })).toBeNull();
  });
});
