/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';

describe('Cascader.Checkable', () => {
  const options = [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Bamboo',
      value: 'bamboo',
      children: [
        {
          label: 'Little',
          value: 'little',
          children: [
            {
              label: 'Toy Fish',
              value: 'fish',
            },
            {
              label: 'Toy Cards',
              value: 'cards',
            },
          ],
        },
      ],
    },
  ];

  it('customize', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cascader options={options} onChange={onChange} open checkable />);

    expect(wrapper.exists('.rc-cascader-checkbox')).toBeTruthy();
    expect(wrapper.exists('.rc-cascader-checkbox-checked')).toBeFalsy();
    expect(wrapper.exists('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

    // Check light
    wrapper.find('.rc-cascader-checkbox').first().simulate('click');
    expect(wrapper.exists('.rc-cascader-checkbox-checked')).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith(
      [['light']],
      [[expect.objectContaining({ value: 'light' })]],
    );

    onChange.mockReset();

    // Open bamboo > little
    wrapper.clickOption(0, 1);
    wrapper.clickOption(1, 0);

    // Check cards
    wrapper.clickOption(2, 1);
    expect(wrapper.exists('.rc-cascader-checkbox-indeterminate')).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith(
      [
        // Light
        ['light'],
        // Cards
        ['bamboo', 'little', 'cards'],
      ],
      [
        // Light
        [expect.objectContaining({ value: 'light' })],
        // Cards
        [
          expect.objectContaining({ value: 'bamboo' }),
          expect.objectContaining({ value: 'little' }),
          expect.objectContaining({ value: 'cards' }),
        ],
      ],
    );
  });

  it('click checkobx invoke one onChange', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cascader options={options} onChange={onChange} open checkable />);

    expect(wrapper.exists('.rc-cascader-checkbox')).toBeTruthy();
    expect(wrapper.exists('.rc-cascader-checkbox-checked')).toBeFalsy();
    expect(wrapper.exists('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

    // Check checkbox
    wrapper.find('.rc-cascader-checkbox').first().simulate('click');
    expect(wrapper.exists('.rc-cascader-checkbox-checked')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // https://github.com/ant-design/ant-design/issues/33302
  it('should not display checkbox when children is empty', () => {
    const wrapper = mount(
      <Cascader checkable options={[]}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.find('.rc-cascader-checkbox').length).toBe(0);
  });
});
