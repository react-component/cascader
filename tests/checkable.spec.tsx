import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Cascader from '../src';
import { addressOptions } from './demoOptions';
import { clickOption } from './util';

describe('Cascader.Checkable', () => {
  const options = [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Bamboo',
      value: 'bamboo',
      children: [
        {
          label: 'Little',
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
  ];

  it('customize', () => {
    const onChange = jest.fn();
    const { container } = render(<Cascader options={options} onChange={onChange} open checkable />);

    expect(container.querySelector('.rc-cascader-checkbox')).toBeTruthy();
    expect(container.querySelector('.rc-cascader-checkbox-checked')).toBeFalsy();
    expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

    // Check light
    const checkboxes = container.querySelectorAll('.rc-cascader-checkbox');
    fireEvent.click(checkboxes[0]);
    expect(container.querySelector('.rc-cascader-checkbox-checked')).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith(
      [['light']],
      [[expect.objectContaining({ value: 'light' })]],
    );

    onChange.mockReset();

    // Open bamboo > little
    clickOption(container, 0, 1); // Click bamboo
    clickOption(container, 1, 0); // Click little

    // Check cards (index 1 in third menu)
    clickOption(container, 2, 1); // Click cards

    const indeterminateCheckboxes = container.querySelectorAll(
      '.rc-cascader-checkbox-indeterminate',
    );
    expect(indeterminateCheckboxes).toHaveLength(2);
    expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith(
      [
        // Light
        ['light'],
        // Cards
        ['bamboo', 'little', 'cards'],
      ],
      [
        // Light
        [expect.objectContaining({ value: 'light' })],
        // Cards
        [
          expect.objectContaining({ value: 'bamboo' }),
          expect.objectContaining({ value: 'little' }),
          expect.objectContaining({ value: 'cards' }),
        ],
      ],
    );

    // Check fish (index 0 in third menu)
    clickOption(container, 2, 0); // Click fish

    const finalIndeterminateCheckboxes = container.querySelectorAll(
      '.rc-cascader-checkbox-indeterminate',
    );
    expect(finalIndeterminateCheckboxes).toHaveLength(0);
    const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
    expect(checkedCheckboxes).toHaveLength(5);
    expect(onChange).toHaveBeenCalledWith(
      [
        // Light
        ['light'],
        // Bamboo
        ['bamboo'],
      ],
      [
        // Light
        [expect.objectContaining({ value: 'light' })],
        // Cards
        [expect.objectContaining({ value: 'bamboo' })],
      ],
    );
  });
  it('click checkbox invoke one onChange', () => {
    const onChange = jest.fn();
    const { container } = render(<Cascader options={options} onChange={onChange} open checkable />);

    expect(container.querySelector('.rc-cascader-checkbox')).toBeTruthy();
    expect(container.querySelector('.rc-cascader-checkbox-checked')).toBeFalsy();
    expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

    // Check checkbox
    const checkboxes = container.querySelectorAll('.rc-cascader-checkbox');
    fireEvent.click(checkboxes[0]);
    expect(container.querySelector('.rc-cascader-checkbox-checked')).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('merge checked options', () => {
    const onChange = jest.fn();

    const { container } = render(
      <Cascader
        checkable
        open
        onChange={onChange}
        options={[
          {
            label: 'Parent',
            value: 'parent',
            children: [
              {
                label: 'Child 1',
                value: 'child1',
              },
              {
                label: 'Child 2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    // Open parent
    clickOption(container, 0, 0);

    // Check child1
    const checkboxes = container.querySelectorAll('span.rc-cascader-checkbox');
    fireEvent.click(checkboxes[1]);
    expect(onChange).toHaveBeenCalledWith([['parent', 'child1']], expect.anything());

    // Check child2
    onChange.mockReset();
    fireEvent.click(checkboxes[2]);
    expect(onChange).toHaveBeenCalledWith([['parent']], expect.anything());

    // Uncheck child1
    onChange.mockReset();
    fireEvent.click(checkboxes[1]);
    expect(onChange).toHaveBeenCalledWith([['parent', 'child2']], expect.anything());
  });

  // https://github.com/ant-design/ant-design/issues/33302
  it('should not display checkbox when children is empty', () => {
    const { container } = render(
      <Cascader checkable options={[]}>
        <input readOnly />
      </Cascader>,
    );
    const input = container.querySelector('input');
    fireEvent.click(input!);
    const checkboxes = container.querySelectorAll('.rc-cascader-checkbox');
    expect(checkboxes.length).toBe(0);
  });

  it('should work with custom checkable', () => {
    const { container } = render(
      <Cascader
        checkable={<span className="my-custom-checkbox">0</span>}
        open
        options={addressOptions}
      />,
    );
    const customCheckboxes = container.querySelectorAll('.my-custom-checkbox');
    expect(customCheckboxes).toHaveLength(3);
  });

  it('should be correct expression with disableCheckbox', () => {
    const { container } = render(
      <Cascader
        checkable={true}
        open
        options={[
          {
            label: '台湾',
            value: 'tw',

            children: [
              {
                label: '福建',
                value: 'fj',
                disableCheckbox: true,
              },
              {
                label: '兰州',
                value: 'lz',
              },
              { label: '北京', value: 'bj' },
            ],
          },
        ]}
      />,
    );

    // disabled className
    const menuItems = container.querySelectorAll('.rc-cascader-menu-item');
    fireEvent.click(menuItems[0]);

    // After clicking, we should have the parent item and its children
    const updatedMenuItems = container.querySelectorAll('.rc-cascader-menu-item');
    expect(updatedMenuItems).toHaveLength(4);
    const disabledCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-disabled');
    expect(disabledCheckboxes).toHaveLength(1);

    // click disableCkeckbox
    fireEvent.click(updatedMenuItems[1]);
    const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
    expect(checkedCheckboxes).toHaveLength(0);

    // click disableMenuItem
    fireEvent.click(disabledCheckboxes[0]);
    expect(checkedCheckboxes).toHaveLength(0);

    // Check all children except disableCheckbox When the parent checkbox is checked
    const allCheckboxes = container.querySelectorAll('.rc-cascader-checkbox');
    expect(allCheckboxes).toHaveLength(4);
    fireEvent.click(allCheckboxes[0]);
    const finalCheckedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
    expect(finalCheckedCheckboxes).toHaveLength(3);
  });

  it('should not merge disabled options', () => {
    const onChange = jest.fn();

    render(
      <Cascader
        open
        defaultValue={[['China', 'beijing']]}
        options={[
          {
            value: 'China',
            label: 'China',
            children: [
              {
                value: 'beijing',
                label: 'beijing',
                disabled: true,
              },
              {
                value: 'shanghai',
                label: 'shanghai',
              },
            ],
          },
        ]}
        checkable
        onChange={onChange}
      />,
    );

    fireEvent.click(
      document.querySelector('[data-path-key="China"] .rc-cascader-checkbox') as HTMLElement,
    );

    expect(onChange).toHaveBeenCalledWith([['China', 'beijing'], ['China']], expect.anything());
  });
});
