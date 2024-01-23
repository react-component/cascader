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
    const onChange = jest.fn();
    const { container } = render(<Cascader.Panel options={options} onChange={onChange} />);

    expect(container.querySelector('.rc-cascader-panel')).toBeTruthy();
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(1);

    // Click first column
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[1]);
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(2);

    // Click second column
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[2]);
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little'], expect.anything());
  });

  it('multiple', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader.Panel checkable options={options} onChange={onChange} />,
    );

    // Click first column - light
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[0]);
    expect(onChange).toHaveBeenCalledWith([['light']], expect.anything());
    onChange.mockReset();

    // Click first column - bamboo (no trigger onChange)
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[1]);
    expect(onChange).not.toHaveBeenCalled();

    // Click second column - little
    fireEvent.click(container.querySelectorAll('.rc-cascader-menu-item')[2]);
    expect(onChange).toHaveBeenCalledWith([['light'], ['bamboo']], expect.anything());
  });

  it('multiple with showCheckedStrategy', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader.Panel
        checkable
        options={options}
        onChange={onChange}
        showCheckedStrategy="SHOW_CHILD"
      />,
    );

    fireEvent.click(container.querySelectorAll('.rc-cascader-checkbox')[1]);
    expect(onChange).toHaveBeenCalledWith([['bamboo', 'little']], expect.anything());
  });

  it('rtl', () => {
    const { container } = render(<Cascader.Panel options={options} direction="rtl" />);

    expect(container.querySelector('.rc-cascader-panel-rtl')).toBeTruthy();
  });

  it('notFoundContent', () => {
    const { container } = render(<Cascader.Panel notFoundContent="Hello World" />);

    expect(container.querySelector('.rc-cascader-panel-empty').textContent).toEqual('Hello World');
  });

  it('control', () => {
    const { container } = render(<Cascader.Panel options={options} value={['bamboo', 'little']} />);

    const checkedLi = container.querySelector('[aria-checked="true"]');
    expect(checkedLi.textContent).toEqual('Little');
  });
});
