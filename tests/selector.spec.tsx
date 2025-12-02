import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import Cascader from '../src';
import { addressOptions } from './demoOptions';
import { expectOpen, clickOption } from './util';

// Mock `useActive` hook
jest.mock('../src/OptionList/useActive', () => (multiple: boolean, open: boolean) => {
  // Pass to origin hooks
  const originHook = jest.requireActual('../src/OptionList/useActive').default;
  const [activeValueCells, setActiveValueCells] = originHook(multiple, open);

  (global as any).activeValueCells = activeValueCells;

  return [activeValueCells, setActiveValueCells];
});

describe('Cascader.Selector', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('clear all', () => {
    it('single', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader value={['not', 'exist']} allowClear onChange={onChange} />,
      );

      fireEvent.mouseDown(container.querySelector('.rc-cascader-clear') as HTMLElement);
      expect(onChange).toHaveBeenCalledWith(undefined, undefined);
    });

    it('Should clear activeCells', () => {
      const onChange = jest.fn();

      const { container } = render(
        <Cascader
          allowClear
          onChange={onChange}
          options={[
            { label: 'Bamboo', value: 'bamboo', children: [{ label: 'Little', value: 'little' }] },
          ]}
        />,
      );

      // Open and select
      fireEvent.mouseDown(container.querySelector('.rc-cascader') as HTMLElement);
      expectOpen(container);

      fireEvent.click(container.querySelector('.rc-cascader-menu-item-content') as HTMLElement);
      fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item-content')[1]);
      expectOpen(container, false);

      // Clear
      fireEvent.mouseDown(container.querySelector('.rc-cascader-clear') as HTMLElement);
      expect((global as any).activeValueCells).toEqual([]);
    });

    it('multiple', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
      );

      fireEvent.mouseDown(container.querySelector('.rc-cascader-clear') as HTMLElement);
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });

  it('remove selector', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
    );

    const removeButtons = container.querySelectorAll('.rc-cascader-selection-item-remove');
    fireEvent.click(removeButtons[0]);
    expect(onChange).toHaveBeenCalledWith([['exist']], expect.anything());
  });

  it('avoid reuse', () => {
    const Tag: React.FC<any> = ({ children, onClose }) => {
      const [visible, setVisible] = useState(true);
      return (
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className={visible ? '' : 'reuse'}
        >
          {children}
        </button>
      );
    };

    const TestComponent = () => {
      const [value, setValue] = useState([['aa'], ['bb'], ['cc'], ['dd'], ['ee']]);
      
      return (
        <Cascader
          options={[
            { label: 'AA', value: 'aa' },
            { label: 'BB', value: 'bb' },
            { label: 'CC', value: 'cc' },
            { label: 'DD', value: 'dd' },
            { label: 'EE', value: 'ee' },
          ]}
          value={value}
          onChange={values => {
            setValue(values);
          }}
          tagRender={({ label, onClose }) => (
            <Tag onClose={onClose} id={label}>
              {label}
            </Tag>
          )}
          checkable
        />
      );
    };

    const { container } = render(<TestComponent />);

    for (let i = 5; i > 0; i--) {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(i);
      fireEvent.click(buttons[0]);
      expect(container.querySelectorAll('.reuse').length).toBe(0);
    }
  });

  it('when selected modify options', () => {
    const { container, rerender } = render(<Cascader options={addressOptions} open />);

    // First column click
    clickOption(container, 0, 0);

    // Second column click
    clickOption(container, 1, 1);

    rerender(<Cascader options={[{ label: '福建', value: 'fj', isLeaf: false }]} open />);
  });
});
