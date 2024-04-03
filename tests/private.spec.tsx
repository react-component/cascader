import { render } from '@testing-library/react';
import React from 'react';
import Cascader from '../src';

describe('Cascader.Private', () => {
  it('dropdownPrefixCls', () => {
    const { container } = render(
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

    expect(container.querySelector('.bamboo-dropdown')).toBeTruthy();
    expect(container.querySelector('.little-menus')).toBeTruthy();
  });
});
