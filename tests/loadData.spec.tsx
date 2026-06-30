import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import { clickOption } from './util';

describe('Cascader.LoadData', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('basic load', () => {
    const loadData = jest.fn();
    const { container, rerender } = render(
      <Cascader
        loadingIcon={<div className="loading-icon" />}
        options={[
          {
            label: 'Bamboo',
            value: 'bamboo',
            isLeaf: false,
          },
        ]}
        loadData={loadData}
        open
      />,
    );

    const menuItems = container.querySelectorAll('.rc-cascader-menu-item-content');
    fireEvent.click(menuItems[0]);
    expect(container.querySelector('.loading-icon')).toBeTruthy();
    expect(loadData).toHaveBeenCalledWith([
      expect.objectContaining({
        value: 'bamboo',
      }),
    ]);

    expect(container.querySelector('.rc-cascader-menu-item-loading')).toBeTruthy();
    expect(container.querySelector('.rc-cascader-menu-item-loading-icon')).toBeTruthy();

    // Fill data
    rerender(
      <Cascader
        loadingIcon={<div className="loading-icon" />}
        options={[
          {
            label: 'Bamboo',
            value: 'bamboo',
            isLeaf: false,
            children: [],
          },
        ]}
        loadData={loadData}
        open
      />,
    );
    expect(container.querySelector('.loading-icon')).toBeFalsy();
  });

  it('not load leaf', () => {
    const loadData = jest.fn();
    const onValueChange = jest.fn();
    const { container } = render(
      <Cascader
        open
        loadData={loadData}
        onChange={onValueChange}
        options={[
          {
            label: 'Light',
            value: 'light',
          },
        ]}
      />,
    );

    clickOption(container, 0, 0);
    expect(onValueChange).toHaveBeenCalled();
    expect(loadData).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/9084
  it('should trigger loadData when expandTrigger is hover', () => {
    const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
      },
    ];
    const loadData = jest.fn();
    const { container } = render(
      <Cascader options={options} loadData={loadData} changeOnSelect expandTrigger="hover">
        <input readOnly />
      </Cascader>,
    );
    const input = container.querySelector('input');
    fireEvent.click(input!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    fireEvent.mouseEnter(menu1Items[0]);
    jest.runAllTimers();
    expect(loadData).toHaveBeenCalled();
  });

  it('change isLeaf back to true should not loop loading', async () => {
    const Demo = () => {
      const [options, setOptions] = React.useState([
        { value: 'zhejiang', label: 'Zhejiang', isLeaf: false },
      ]);

      const loadData = () => {
        Promise.resolve().then(() => {
          act(() => {
            setOptions([
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                isLeaf: true,
              },
            ]);
          });
        });
      };

      return <Cascader options={options} loadData={loadData} open />;
    };

    const { container } = render(<Demo />);
    const menuItems = container.querySelectorAll('.rc-cascader-menu-item-content');
    fireEvent.click(menuItems[0]);
    expect(container.querySelector('.rc-cascader-menu-item-loading')).toBeTruthy();

    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }

    expect(container.querySelector('.rc-cascader-menu-item-loading')).toBeFalsy();
  });

  it('nest load should not crash', async () => {
    const Demo = () => {
      const [options, setOptions] = React.useState([{ label: 'top', value: 'top', isLeaf: false }]);

      const loadData: CascaderProps['loadData'] = selectedOptions => {
        Promise.resolve().then(() => {
          act(() => {
            selectedOptions[selectedOptions.length - 1].children = [
              {
                label: 'child',
                value: 'child',
                isLeaf: false,
              },
            ];
            setOptions(list => [...list]);
          });
        });
      };

      return <Cascader options={options} loadData={loadData} open />;
    };

    const { container } = render(<Demo />);

    // First column click
    const menuItems = container.querySelectorAll('.rc-cascader-menu-item-content');
    fireEvent.click(menuItems[menuItems.length - 1]);
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }

    // Second column click
    const updatedMenuItems = container.querySelectorAll('.rc-cascader-menu-item-content');
    fireEvent.click(updatedMenuItems[updatedMenuItems.length - 1]);
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }

    const menus = container.querySelectorAll('ul.rc-cascader-menu');
    expect(menus).toHaveLength(3);
  });
});
