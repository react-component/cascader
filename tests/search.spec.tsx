import { fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { resetWarned } from '@rc-component/util/lib/warning';
import React from 'react';
import Cascader from '../src';
import { optionsForActiveMenuItems } from './demoOptions';
import { expectOpen, doSearch, keyDown } from './util';

describe('Cascader.Search', () => {
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
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('default search', () => {
    const onSearch = jest.fn();
    const onChange = jest.fn();
    const { container } = render(
      <Cascader options={options} onChange={onChange} onSearch={onSearch} open showSearch />,
    );

    // Leaf
    doSearch(container, 'toy');
    let itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('toy');

    // Parent
    doSearch(container, 'Label Little');
    itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('Label Little');

    // Change
    fireEvent.click(itemList[0]);
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little', 'fish'], expect.anything());
  });

  it('changeOnSelect', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader options={options} onChange={onChange} open showSearch changeOnSelect />,
    );

    // Leaf
    doSearch(container, 'Label Little');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(3);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList[2].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');

    // Should not expandable
    expect(container.querySelector('.rc-cascader-menu-item-expand-icon')).toBeFalsy();

    // Trigger onChange
    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.ENTER);
    expect(onChange).toHaveBeenCalledWith(['bamboo', 'little'], expect.anything());
  });

  it('sort', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          sort: (pathA, pathB) => {
            const finalA = pathA[pathA.length - 1];
            const finalB = pathB[pathB.length - 1];

            // this value is string
            if ((finalA.value as any) < (finalB.value as any)) {
              return -1;
            }
            return 1;
          },
        }}
      />,
    );

    doSearch(container, 'toy');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
  });

  it('limit', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          limit: 1,
        }}
      />,
    );

    doSearch(container, 'toy');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(1);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
  });

  it('render', () => {
    const { container } = render(
      <Cascader
        options={options}
        open
        showSearch={{
          render: (inputValue, optList, prefixCls) =>
            `${prefixCls}-${inputValue}-${optList.map(opt => opt.value).join('~')}`,
        }}
      />,
    );

    doSearch(container, 'toy');
    const itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('rc-cascader-toy-bamboo~little~fish');
    expect(itemList[1].textContent).toEqual('rc-cascader-toy-bamboo~little~cards');
  });

  it('not crash when empty', () => {
    const onChange = jest.fn();
    const { container } = render(<Cascader options={options} onChange={onChange} showSearch />);
    doSearch(container, 'toy');

    // Selection empty - pressing ENTER without selecting anything should not trigger onChange
    const input = container.querySelector('input')!;
    fireEvent.keyDown(input, { which: KeyCode.ENTER });
    expect(onChange).not.toHaveBeenCalled();

    // Select first item - this should trigger onChange
    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.ENTER);
    expect(onChange).toHaveBeenCalled();

    // Content empty
    doSearch(container, 'not exist');
    expect(container.querySelectorAll('.rc-cascader-menu-empty')).toHaveLength(1);
  });

  it('warning of negative limit', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(<Cascader options={options} showSearch={{ limit: 0 }} />);

    expect(errorSpy).toHaveBeenCalledWith(
      "Warning: 'limit' of showSearch should be positive number or false.",
    );

    doSearch(container, 'toy');
    expect(container.querySelectorAll('div.rc-cascader-menu-item-content')).toHaveLength(2);

    errorSpy.mockRestore();
  });

  it('onChange should be triggered when click option with changeOnSelect + multiple', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader checkable options={options} changeOnSelect onChange={onChange} showSearch />,
    );
    doSearch(container, 'toy');
    const firstItem = container.querySelector('.rc-cascader-menu-item')!;
    fireEvent.click(firstItem);
    fireEvent.mouseDown(firstItem);
    expect(onChange).toHaveBeenCalledWith([['bamboo', 'little', 'fish']], expect.anything());

    doSearch(container, 'light');
    const firstItem2 = container.querySelector('.rc-cascader-menu-item')!;
    fireEvent.click(firstItem2);
    fireEvent.mouseDown(firstItem2);
    expect(onChange).toHaveBeenCalledWith(
      [['bamboo', 'little', 'fish'], ['light']],
      expect.anything(),
    );
  });

  it('onChange should be triggered when click option with multiple', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader checkable options={options} onChange={onChange} showSearch />,
    );
    doSearch(container, 'toy');
    const firstItem = container.querySelector('.rc-cascader-menu-item')!;
    fireEvent.click(firstItem);
    fireEvent.mouseDown(firstItem);
    expect(onChange).toHaveBeenCalledWith([['bamboo', 'little', 'fish']], expect.anything());

    doSearch(container, 'light');
    const firstItem2 = container.querySelector('.rc-cascader-menu-item')!;
    fireEvent.click(firstItem2);
    fireEvent.mouseDown(firstItem2);
    expect(onChange).toHaveBeenCalledWith(
      [['bamboo', 'little', 'fish'], ['light']],
      expect.anything(),
    );
  });

  it('should not crash when exist options with same value on different levels', () => {
    const { container } = render(<Cascader options={optionsForActiveMenuItems} />);

    doSearch(container, '1');
    const firstItem = container.querySelector('.rc-cascader-menu-item')!;
    fireEvent.click(firstItem);
    doSearch(container, '1');
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
    const { container } = render(
      <Cascader
        options={customOptions}
        fieldNames={{ label: 'name', value: 'name' }}
        showSearch={{
          filter: (inputValue, path) =>
            path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
        }}
      />,
    );
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'z' } });
    expect(container).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/41810
  // TODO: fix this
  it.skip('not back to options when selected', () => {
    const { container } = render(<Cascader options={options} showSearch />);

    // Search
    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: {
        value: 'bamboo',
      },
    });

    // Get all search results
    const searchResults = container.querySelectorAll('.rc-cascader-menu-item-content');

    // Click on the first item (which should be the one we want)
    fireEvent.click(searchResults[0] as HTMLElement);
    expectOpen(container, false);
    expect(container.querySelector('.rc-cascader-menu-item-content')?.textContent).toBe(
      'Label Bamboo / Label Little / Toy Fish',
    );
  });

  it('autoClearSearchValue={false} should be worked', () => {
    const { container } = render(
      <Cascader options={options} showSearch checkable autoClearSearchValue={false} />,
    );

    // Search
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'bamboo' } });

    // Click
    const firstCheckbox = container.querySelector('.rc-cascader-checkbox')!;
    fireEvent.click(firstCheckbox);
    expect((input as HTMLInputElement).value).toEqual('bamboo');
  });

  it('disabled path should not search', () => {
    const { container } = render(
      <Cascader
        open
        searchValue="little"
        showSearch
        options={[
          {
            label: 'bamboo',
            value: 'bamboo',
            disabled: true,
            children: [
              {
                label: 'little',
                value: 'little',
              },
            ],
          },
        ]}
      />,
    );

    expect(container.querySelectorAll('.rc-cascader-menu-item')).toHaveLength(1);
    expect(container.querySelectorAll('.rc-cascader-menu-item-disabled')).toHaveLength(1);
    expect(container.querySelector('.rc-cascader-menu-item-disabled')?.textContent).toEqual(
      'bamboo / little',
    );
  });
  it('Should optionRender work', () => {
    const { container, rerender } = render(
      <Cascader
        open
        options={[{ label: 'bamboo', value: 'bamboo' }]}
        optionRender={option => `${option.label} - test`}
      />,
    );
    expect(container.querySelector('.rc-cascader-menu-item-content')?.innerHTML).toEqual(
      'bamboo - test',
    );
    rerender(
      <Cascader
        open
        options={[{ label: 'bamboo', disabled: true, value: 'bamboo' }]}
        optionRender={option => JSON.stringify(option)}
      />,
    );
    expect(container.querySelector('.rc-cascader-menu-item-content')?.innerHTML).toEqual(
      '{"label":"bamboo","disabled":true,"value":"bamboo"}',
    );
  });

  it('onSearch and searchValue in showSearch', () => {
    const onSearch = jest.fn();
    const { container } = render(<Cascader options={options} open showSearch={{ onSearch }} />);

    // Leaf
    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: { value: 'toy' },
    });
    let itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('toy');

    // Parent
    fireEvent.change(container.querySelector('input') as HTMLElement, {
      target: { value: 'Label Little' },
    });
    itemList = container.querySelectorAll('div.rc-cascader-menu-item-content');
    expect(itemList).toHaveLength(2);
    expect(itemList[0].textContent).toEqual('Label Bamboo / Label Little / Toy Fish');
    expect(itemList[1].textContent).toEqual('Label Bamboo / Label Little / Toy Cards');
    expect(onSearch).toHaveBeenCalledWith('Label Little');
  });

  it('searchValue in showSearch', () => {
    const { container } = render(
      <Cascader
        open
        showSearch={{ searchValue: 'little' }}
        options={[
          {
            label: 'bamboo',
            value: 'bamboo',
            children: [
              {
                label: 'little',
                value: 'little',
              },
            ],
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('.rc-cascader-menu-item')).toHaveLength(1);
    expect(container.querySelector('input') as HTMLInputElement).toHaveValue('little');
  });

  it('autoClearSearchValue in showSearch', () => {
    const { container } = render(
      <Cascader
        open
        checkable
        showSearch={{ autoClearSearchValue: false }}
        options={[
          {
            label: 'bamboo',
            value: 'bamboo',
            children: [
              {
                label: 'little',
                value: 'little',
              },
            ],
          },
        ]}
      />,
    );

    const inputNode = container.querySelector<HTMLInputElement>('input');
    fireEvent.change(inputNode as HTMLInputElement, { target: { value: 'little' } });
    expect(inputNode).toHaveValue('little');
    fireEvent.click(document.querySelector('.rc-cascader-checkbox') as HTMLElement);
    expect(inputNode).toHaveValue('little');
  });
});
