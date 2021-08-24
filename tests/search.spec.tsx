/* eslint-disable @typescript-eslint/consistent-type-imports */

import React from 'react';
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
    const wrapper = mount(<Cascader options={options} open showSearch />);

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
});
