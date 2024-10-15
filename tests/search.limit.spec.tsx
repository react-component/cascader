import React from 'react';
import Cascader from '../src';
import type { ReactWrapper } from './enzyme';
import { mount } from './enzyme';

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
      region: 'Asia',
      children: [],
      isParent: true,
      label: 'Asia',
      value: 'Asia',
    },
  ];
  for (let i = 0; i < 100; i++) {
    options[0].children.push({
      id: i,
      label: 'label' + i,
      value: 'value' + i,
    });
  }

  it('limit', () => {
    const wrapper = mount(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: false,
        }}
      />,
    );

    doSearch(wrapper, 'as');
    const itemList = wrapper.find('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(itemList.length);
  });
});