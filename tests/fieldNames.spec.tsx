/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { mount } from './enzyme';
import Cascader from '../src';

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
  ] as any;

  const fieldNames = {
    label: 'customTitle',
    value: 'customValue',
    children: 'customChildren',
  };

  it('customize', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Cascader options={options} fieldNames={fieldNames} onChange={onChange} />,
    );

    // Open
    wrapper.find('.rc-cascader-selector').simulate('mousedown');
    expect(wrapper.isOpen()).toBeTruthy();

    // Check values
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(1);
    expect(wrapper.find('.rc-cascader-menu').at(0).find('.rc-cascader-menu-item')).toHaveLength(2);

    // Click Bamboo
    wrapper.clickOption(0, 1);
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(2);
    expect(wrapper.find('.rc-cascader-menu').at(1).find('.rc-cascader-menu-item')).toHaveLength(1);

    // Click Little & Toy
    wrapper.clickOption(1, 0);
    wrapper.clickOption(2, 0);

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
    const wrapper = mount(
      <Cascader
        options={options}
        fieldNames={fieldNames}
        defaultValue={['bamboo', 'little', 'toy']}
        expandIcon=""
        open
      />,
    );

    expect(wrapper.find('.rc-cascader-selection-item').text()).toEqual('Bamboo / Little / Toy');

    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(3);
    expect(wrapper.find('.rc-cascader-menu-item-active')).toHaveLength(3);
    expect(wrapper.find('.rc-cascader-menu-item-active').at(0).text()).toEqual('Bamboo');
    expect(wrapper.find('.rc-cascader-menu-item-active').at(1).text()).toEqual('Little');
    expect(wrapper.find('.rc-cascader-menu-item-active').at(2).text()).toEqual('Toy');
  });

  it('displayRender', () => {
    const wrapper = mount(
      <Cascader
        options={options}
        fieldNames={fieldNames}
        defaultValue={['bamboo', 'little', 'toy']}
        displayRender={(labels, selectOptions) =>
          `${labels.join('->')} & ${selectOptions.map((opt: any) => opt.customValue).join('>>')}`
        }
      />,
    );

    expect(wrapper.find('.rc-cascader-selection-item').text()).toEqual(
      'Bamboo->Little->Toy & bamboo>>little>>toy',
    );
  });

  it('same title & value should show correct title', () => {
    const wrapper = mount(
      <Cascader
        options={[{ name: 'bamboo', children: [{ name: 'little' }] }] as any}
        open
        defaultValue={['bamboo', 'little']}
        fieldNames={{
          label: 'name',
          value: 'name',
        }}
      />,
    );

    expect(wrapper.find('.rc-cascader-menu-item').last().text()).toEqual('little');
  });

  it('should be no warning when use key field as value', () => {
    const option = [
      {
        title: '福建',
        key: 'fj',
        children: [
          {
            title: '福州',
            key: 'fuzhou',
            children: [
              {
                title: '马尾',
                key: 'mawei',
              },
            ],
          },
        ],
      },
    ] as any;
    let warning = false;
    jest.spyOn(console, 'error').mockImplementation(() => {
      warning = true;
    });
    mount(
      <Cascader
        options={option}
        fieldNames={{
          label: 'title',
          value: 'key',
        }}
      />,
    );

    expect(warning).toBe(false);
  });
});
