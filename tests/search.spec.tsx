/* eslint-disable @typescript-eslint/consistent-type-imports */

import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { resetWarned } from 'rc-util/lib/warning';
import { mount, ReactWrapper } from './enzyme';
import Cascader from '../src';
import { optionsForActiveMenuItems } from './demoOptions';

describe('Cascader.Search', () => {
  function doSearch(wrapper: ReactWrapper, search: string) {
    wrapper.find('input').simulate('change', {
      target: {
        value: search,
      },
    });
  }

  const options = [
    {
      label: 'Label Light',
      value: 'light',
    },
    {
      label: 'Label Bamboo',
      value: 'bamboo',
      children: [
        {
          label: 'Label Little',
          value: 'little',
          children: [
            {
              label: 'Toy Fish',
              value: 'fish',
              // Leave a empty children here. But cascader should think this is a leaf node.
              children: [],
            },
            {
              label: 'Toy Cards',
              value: 'cards',
            },
          ],
        },
      ],
    },
  ] as any;

  it('default search', () => {
    const onSearch = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader options={options} onChange={onChange} onSearch={onSearch} open showSearch />,
    );

    // Leaf
    doSearch(wrapper, 'toy');
    let itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('toy');

    // Parent
    doSearch(wrapper, 'Label Little');
    itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('Label Little');

    // Change
    wrapper.clickOption(0, 0);
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little', 'fish'], expect.anything());
  });

  it('changeOnSelect', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader options={options} onChange={onChange} open showSearch changeOnSelect />,
    );

    // Leaf
    doSearch(wrapper, 'Label Little');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(3);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(2).text()).toEqual('Label Bamboo / Label Little / Toy Cards');

    // Should not expandable
    expect(wrapper.exists('.rc-cascader-menu-item-expand-icon')).toBeFalsy();

    // Trigger onChange
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little'], expect.anything());
  });

  it('sort', () => {
    const wrapper = mount(
      <Cascader
        options={options}
        open
        showSearch={{
          sort: (pathA, pathB) => {
            const finalA = pathA[pathA.length - 1];
            const finalB = pathB[pathB.length - 1];

            if (finalA.value < finalB.value) {
              return -1;
            }
            return 1;
          },
        }}
      />,
    );

    doSearch(wrapper, 'toy');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
  });

  it('limit', () => {
    const wrapper = mount(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: 1,
        }}
      />,
    );

    doSearch(wrapper, 'toy');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(1);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
  });

  it('render', () => {
    const wrapper = mount(
      <Cascader
        options={options}
        open
        showSearch={{
          render: (inputValue, optList, prefixCls) =>
            `${prefixCls}-${inputValue}-${optList.map(opt => opt.value).join('~')}`,
        }}
      />,
    );

    doSearch(wrapper, 'toy');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('rc-cascader-toy-bamboo~little~fish');
    expect(itemList.at(1).text()).toEqual('rc-cascader-toy-bamboo~little~cards');
  });

  it('not crash when empty', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cascader options={options} onChange={onChange} showSearch />);
    doSearch(wrapper, 'toy');

    // Selection empty
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(onChange).not.toHaveBeenCalled();

    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(onChange).toHaveBeenCalled();

    // Content empty
    doSearch(wrapper, 'not exist');
    expect(wrapper.exists('.rc-cascader-menu-empty')).toBeTruthy();
  });

  it('warning of negative limit', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(<Cascader options={options} showSearch={{ limit: 0 }} />);

    expect(errorSpy).toHaveBeenCalledWith(
      "Warning: 'limit' of showSearch should be positive number or false.",
    );

    doSearch(wrapper, 'toy');
    expect(wrapper.find('div.rc-cascader-menu-item-content')).toHaveLength(2);

    errorSpy.mockRestore();
  });

  it('onChange should be triggered when click option with multiple', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader checkable options={options} changeOnSelect onChange={onChange} showSearch />,
    );
    doSearch(wrapper, 'toy');
    wrapper.find('.rc-cascader-menu-item').first().simulate('click');
    wrapper.find('.rc-cascader-menu-item').first().simulate('mousedown');
    expect(onChange).toHaveBeenCalledWith([['bamboo', 'little', 'fish']], expect.anything());
  });

  it('should not crash when exist options with same value on different levels', () => {
    const wrapper = mount(<Cascader options={optionsForActiveMenuItems} />);

    doSearch(wrapper, '1');
    wrapper.find('.rc-cascader-menu-item').first().simulate('click');
    doSearch(wrapper, '1');
  });

  it('should correct render Cascader with same field name of label and value', () => {
    const customOptions = [
      {
        name: 'Zhejiang',
        children: [
          {
            name: 'Hangzhou',
            children: [
              {
                name: 'West Lake',
              },
              {
                name: 'Xia Sha',
                disabled: true,
              },
            ],
          },
        ],
      },
    ];
    function customFilter(inputValue, path) {
      return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }
    const wrapper = mount(
      <Cascader
        options={customOptions}
        fieldNames={{ label: 'name', value: 'name' }}
        showSearch={{ filter: customFilter }}
      />,
    );
    wrapper.find('input').simulate('change', { target: { value: 'z' } });
    expect(wrapper.render()).toMatchSnapshot();
  });
});
