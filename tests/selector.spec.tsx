import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';
import { addressOptions } from './demoOptions';

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

    wrapper.find('.rc-cascader-selection-item-remove-icon').first().simulate('click');
    expect(onChange).toHaveBeenCalledWith([['exist']], expect.anything());
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
