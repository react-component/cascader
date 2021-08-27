/* eslint-disable @typescript-eslint/consistent-type-imports */

import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';

describe('Cascader.Private', () => {
  it('dropdownPrefixCls', () => {
    const wrapper = mount(
      <Cascader
        defaultValue={['light', 'toy']}
        options={[
          {
            label: 'Light',
            value: 'light',
            children: [
              {
                label: 'Toy',
                value: 'toy',
              },
            ],
          },
        ]}
        open
        prefixCls="bamboo"
        dropdownPrefixCls="little"
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });
});
