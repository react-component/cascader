/* eslint-disable react/jsx-no-bind */

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Cascader, { type CascaderProps } from '../src';

describe('Cascader.Panel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const options: CascaderProps['options'] = [
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
        },
      ],
    },
  ];

  it('basic', () => {
    const { container } = render(<Cascader.Panel options={options} />);

    expect(container.querySelector('.rc-cascader-panel')).toBeTruthy();
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(1);

    // Click first
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[1]);
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(2);
  });
});
