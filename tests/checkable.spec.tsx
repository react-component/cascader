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
    expect(wrapper.find('.rc-cascader-checkbox-indeterminate')).toHaveLength(2);
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

    // Check fish
    wrapper.clickOption(2, 0);
    expect(wrapper.find('.rc-cascader-checkbox-indeterminate')).toHaveLength(0);
    expect(wrapper.find('.rc-cascader-checkbox-checked')).toHaveLength(5);
    expect(onChange).toHaveBeenCalledWith(
      [
        // Light
        ['light'],
        // Bamboo
        ['bamboo'],
      ],
      [
        // Light
        [expect.objectContaining({ value: 'light' })],
        // Cards
        [expect.objectContaining({ value: 'bamboo' })],
      ],
    );
  });
  it('click checkbox invoke one onChange', () => {
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

  it('merge checked options', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <Cascader
        checkable
        open
        onChange={onChange}
        options={[
          {
            label: 'Parent',
            value: 'parent',
            children: [
              {
                label: 'Child 1',
                value: 'child1',
              },
              {
                label: 'Child 2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    // Open parent
    wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');

    // Check child1
    wrapper.find('span.rc-cascader-checkbox').at(1).simulate('click');
    expect(onChange).toHaveBeenCalledWith([['parent', 'child1']], expect.anything());

    // Check child2
    onChange.mockReset();
    wrapper.find('span.rc-cascader-checkbox').at(2).simulate('click');
    expect(onChange).toHaveBeenCalledWith([['parent']], expect.anything());

    // Uncheck child1
    onChange.mockReset();
    wrapper.find('span.rc-cascader-checkbox').at(1).simulate('click');
    expect(onChange).toHaveBeenCalledWith([['parent', 'child2']], expect.anything());
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
