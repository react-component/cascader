import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from './enzyme';
import type { CascaderProps } from '../src';
import Cascader from '../src';

describe('Cascader.LoadData', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('basic load', () => {
    const loadData = jest.fn();
    const wrapper = mount(
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

    wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');
    expect(wrapper.exists('.loading-icon')).toBeTruthy();
    expect(loadData).toHaveBeenCalledWith([
      expect.objectContaining({
        value: 'bamboo',
      }),
    ]);

    expect(wrapper.exists('.rc-cascader-menu-item-loading')).toBeTruthy();
    expect(wrapper.exists('.rc-cascader-menu-item-loading-icon')).toBeTruthy();

    // Fill data
    wrapper.setProps({
      options: [
        {
          label: 'Bamboo',
          value: 'bamboo',
          isLeaf: false,
          children: [],
        },
      ],
    });
    wrapper.update();
    expect(wrapper.exists('.loading-icon')).toBeFalsy();
  });

  it('not load leaf', () => {
    const loadData = jest.fn();
    const onValueChange = jest.fn();
    const wrapper = mount(
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

    wrapper.clickOption(0, 0);
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
    const wrapper = mount(
      <Cascader options={options} loadData={loadData} changeOnSelect expandTrigger="hover">
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('mouseEnter');
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

    const wrapper = mount(<Demo />);
    wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');
    expect(wrapper.exists('.rc-cascader-menu-item-loading')).toBeTruthy();

    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }
    wrapper.update();

    expect(wrapper.exists('.rc-cascader-menu-item-loading')).toBeFalsy();
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

    const wrapper = mount(<Demo />);

    // First column click
    wrapper.find('.rc-cascader-menu-item-content').last().simulate('click');
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }
    wrapper.update();

    // Second column click
    wrapper.find('.rc-cascader-menu-item-content').last().simulate('click');
    for (let i = 0; i < 3; i += 1) {
      await Promise.resolve();
    }
    wrapper.update();

    expect(wrapper.find('ul.rc-cascader-menu')).toHaveLength(3);
  });
});
