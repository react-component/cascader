import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Cascader from '../src';
import { clickOption, expectOpen } from './util';

describe('Cascader.FieldNames', () => {
  const options = [
    {
      customTitle: 'Light',
      customValue: 'light',
    },
    {
      customTitle: 'Bamboo',
      customValue: 'bamboo',
      customChildren: [
        {
          customTitle: 'Little',
          customValue: 'little',
          customChildren: [
            {
              customTitle: 'Toy',
              customValue: 'toy',
            },
          ],
        },
      ],
    },
  ];

  const fieldNames = {
    label: 'customTitle',
    value: 'customValue',
    children: 'customChildren',
  } as const;

  it('customize', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Cascader options={options} fieldNames={fieldNames} onChange={onChange} />,
    );

    // Open
    const cascader = container.querySelector('.rc-cascader');
    fireEvent.mouseDown(cascader!);
    expectOpen(container);

    // Check values
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus).toHaveLength(1);
    const menuItems = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menuItems).toHaveLength(2);

    // Click Bamboo
    clickOption(container, 0, 1);
    const updatedMenus = container.querySelectorAll('.rc-cascader-menu');
    expect(updatedMenus).toHaveLength(2);
    const updatedMenuItems = updatedMenus[1].querySelectorAll('.rc-cascader-menu-item');
    expect(updatedMenuItems).toHaveLength(1);

    // Click Little & Toy
    clickOption(container, 1, 0);
    clickOption(container, 2, 0);

    expect(onChange).toHaveBeenCalledWith(
      ['bamboo', 'little', 'toy'],
      [
        expect.objectContaining({ customTitle: 'Bamboo', customValue: 'bamboo' }),
        expect.objectContaining({ customTitle: 'Little', customValue: 'little' }),
        expect.objectContaining({ customTitle: 'Toy', customValue: 'toy' }),
      ],
    );
  });

  it('defaultValue', () => {
    const { container } = render(
      <Cascader
        options={options}
        fieldNames={fieldNames}
        defaultValue={['bamboo', 'little', 'toy']}
        expandIcon=""
        open
      />,
    );

    const contentValue = container.querySelector('.rc-cascader-content-value');
    expect(contentValue?.textContent).toEqual('Bamboo / Little / Toy');

    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus).toHaveLength(3);
    const activeItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeItems).toHaveLength(3);
    expect(activeItems[0].textContent).toEqual('Bamboo');
    expect(activeItems[1].textContent).toEqual('Little');
    expect(activeItems[2].textContent).toEqual('Toy');
  });

  it('displayRender', () => {
    const { container } = render(
      <Cascader
        options={options}
        fieldNames={fieldNames}
        defaultValue={['bamboo', 'little', 'toy']}
        displayRender={(labels, selectOptions) =>
          `${labels.join('->')} & ${selectOptions?.map(opt => opt.customValue).join('>>')}`
        }
      />,
    );

    const contentValue = container.querySelector('.rc-cascader-content-value');
    expect(contentValue?.textContent).toEqual('Bamboo->Little->Toy & bamboo>>little>>toy');
  });

  it('same title & value should show correct title', () => {
    const { container } = render(
      <Cascader
        options={[{ name: 'bamboo', children: [{ name: 'little' }] }]}
        open
        defaultValue={['bamboo', 'little']}
        fieldNames={{
          label: 'name',
          value: 'name',
        }}
      />,
    );

    const menuItems = container.querySelectorAll('.rc-cascader-menu-item');
    expect(menuItems[menuItems.length - 1].textContent).toEqual('little');
  });

  it('empty should correct when label same as value', () => {
    const { container } = render(
      <Cascader
        options={[]}
        open
        searchValue="not-exist"
        fieldNames={{
          label: 'same',
          value: 'same',
        }}
      />,
    );

    const menuItems = container.querySelectorAll('.rc-cascader-menu-item');
    expect(menuItems[menuItems.length - 1].textContent).toEqual('Not Found');
  });

  it('`null` is a value in fieldNames options should throw a warning', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    render(
      <Cascader
        fieldNames={fieldNames}
        options={[
          {
            customTitle: '四川',
            customValue: 'sc',
            customChildren: [
              {
                customTitle: '成都',
                customValue: 'cd',
                customChildren: [
                  {
                    customTitle: '天府新区',
                    customValue: null,
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `value` in Cascader options should not be `null`.',
    );
    errorSpy.mockReset();
  });
});
