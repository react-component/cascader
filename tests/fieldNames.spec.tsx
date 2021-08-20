/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';

describe('Cascader.FieldNames', () => {
  it('customize', () => {
    const options = [
      {
        customTitle: 'Light',
        customValue: 'light',
      },
      {
        customTitle: 'Bamboo',
        customValue: 'bamboo',
        customChildren: [
          {
            customTitle: 'Little',
            customValue: 'little',
          },
        ],
      },
    ];

    const wrapper = mount(
      <Cascader
        options={options as any}
        fieldNames={{ label: 'customTitle', value: 'customValue', children: 'customChildren' }}
      />,
    );

    // Open
    wrapper.find('.rc-cascader-selector').simulate('mousedown');
    expect(wrapper.isOpen()).toBeTruthy();

    // Check values
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(1);
    expect(wrapper.find('.rc-cascader-menu').at(0).find('.rc-cascader-menu-item')).toHaveLength(2);
  });
});
