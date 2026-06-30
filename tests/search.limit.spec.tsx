import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Cascader from '../src';

describe('Cascader.Search', () => {
  function doSearch(container: HTMLElement, search: string) {
    const input = container.querySelector('input');
    fireEvent.change(input!, {
      target: {
        value: search,
      },
    });
  }
  const options = [
    {
      children: [] as any[],
      isParent: true,
      label: 'Asia',
      value: 'Asia',
    },
  ];
  for (let i = 0; i < 100; i++) {
    options[0].children.push({
      label: 'label' + i,
      value: 'value' + i,
    });
  }

  it('limit', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: false,
        }}
      />,
    );

    doSearch(container, 'as');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(100);
  });

  it('limit', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: 0,
        }}
      />,
    );

    doSearch(container, 'as');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(100);
  });

  it('limit', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: 20,
        }}
      />,
    );

    doSearch(container, 'as');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(20);
  });
});
