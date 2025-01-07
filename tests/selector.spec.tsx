import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { mount } from './enzyme';
import Cascader from '../src';
import { addressOptions } from './demoOptions';

// Mock `useActive` hook
jest.mock('../src/OptionList/useActive', () => (multiple: boolean, open: boolean, defaultActiveKey: React.Key[]) => {
  // Pass to origin hooks
  const originHook = jest.requireActual('../src/OptionList/useActive').default;
  const [activeValueCells, setActiveValueCells] = originHook(multiple, open, defaultActiveKey);

  (global as any).activeValueCells = activeValueCells;

  return [activeValueCells, setActiveValueCells];
});

describe('Cascader.Selector', () => {
  describe('clear all', () => {
    it('single', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader value={['not', 'exist']} allowClear onChange={onChange} />,
      );

      fireEvent.mouseDown(container.querySelector('.rc-cascader-clear-icon') as HTMLElement);
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
      fireEvent.mouseDown(container.querySelector('.rc-cascader-selector') as HTMLElement);
      expect(container.querySelector('.rc-cascader-open')).toBeTruthy();

      fireEvent.click(container.querySelector('.rc-cascader-menu-item-content') as HTMLElement);
      fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item-content')[1]);
      expect(container.querySelector('.rc-cascader-open')).toBeFalsy();

      // Clear
      fireEvent.mouseDown(container.querySelector('.rc-cascader-clear-icon') as HTMLElement);
      expect((global as any).activeValueCells).toEqual([]);
    });

    it('multiple', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
      );

      wrapper.find('.rc-cascader-clear-icon').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });

  it('remove selector', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader checkable value={[['not'], ['exist']]} allowClear onChange={onChange} />,
    );

    wrapper.find('.rc-cascader-selection-item-remove-icon').first().simulate('click');
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

    const wrapper = mount(
      <Cascader
        options={[
          { label: 'AA', value: 'aa' },
          { label: 'BB', value: 'bb' },
          { label: 'CC', value: 'cc' },
          { label: 'DD', value: 'dd' },
          { label: 'EE', value: 'ee' },
        ]}
        value={[['aa'], ['bb'], ['cc'], ['dd'], ['ee']]}
        onChange={values => {
          wrapper.setProps({
            value: values,
          });
        }}
        tagRender={({ label, onClose }) => (
          <Tag onClose={onClose} id={label}>
            {label}
          </Tag>
        )}
        checkable
      />,
    );

    for (let i = 5; i > 0; i--) {
      const buttons = wrapper.find('button');
      expect(buttons.length).toBe(i);
      buttons.first().simulate('click');
      wrapper.update();
      expect(wrapper.find('.reuse').length).toBe(0);
    }
  });

  it('when selected modify options', () => {
    const wrapper = mount(<Cascader options={addressOptions} open />);

    // First column click
    wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');
    wrapper.update();

    // Second column click
    wrapper.find('.rc-cascader-menu-item-content').last().simulate('click');
    wrapper.update();

    wrapper.setProps({
      options: [{ label: '福建', value: 'fj', isLeaf: false }],
    });

    wrapper.update();
  });
});
