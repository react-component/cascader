/* eslint-disable @typescript-eslint/consistent-type-imports */

import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { mount, ReactWrapper } from './enzyme';
import Cascader from '../src';

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
    const onChange = jest.fn();
    const wrapper = mount(<Cascader options={options} onChange={onChange} open showSearch />);

    // Leaf
    doSearch(wrapper, 'toy');
    let itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Cards');

    // Parent
    doSearch(wrapper, 'Label Little');
    itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Cards');

    // Change
    wrapper.clickOption(0, 0);
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little', 'fish'], expect.anything());
  });

  it('changeOnSelect', () => {
    const wrapper = mount(<Cascader options={options} open showSearch changeOnSelect />);

    // Leaf
    doSearch(wrapper, 'Label Little');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(3);
    expect(itemList.at(0).text()).toEqual('Label Bamboo / Label Little');
    expect(itemList.at(1).text()).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList.at(2).text()).toEqual('Label Bamboo / Label Little / Toy Cards');
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
});
