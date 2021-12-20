import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';

describe('Cascader.Selector', () => {
  describe('clear all', () => {
    it('single', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Cascader value={['not', 'exist']} allowClear onChange={onChange} />);

      wrapper.find('.rc-cascader-clear-icon').simulate('mouseDown');
      expect(onChange).toHaveBeenCalledWith(undefined, undefined);
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

    wrapper.find('.rc-cascader-selection-item-remove-icon').simulate('mouseDown');
  });
});
