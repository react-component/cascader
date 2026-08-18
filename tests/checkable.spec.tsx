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

  // ========================= checkStrictly =========================
  describe('checkStrictly', () => {
    it('clicking parent does not check children, and no indeterminate', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader options={options} onChange={onChange} open checkable checkStrictly />,
      );

      // Open bamboo > little
      clickOption(container, 0, 1); // Click bamboo
      clickOption(container, 1, 0); // Click little

      // Check parent `bamboo`
      const bambooCheckbox = container.querySelector(
        '[data-path-key="bamboo"] .rc-cascader-checkbox',
      ) as HTMLElement;
      fireEvent.click(bambooCheckbox);

      // Only bamboo is checked, children stay unchecked
      const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
      expect(checkedCheckboxes).toHaveLength(1);
      // No indeterminate under checkStrictly
      expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

      expect(onChange).toHaveBeenCalledWith([['bamboo']], expect.anything());
    });

    it('clicking child does not affect parent', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader options={options} onChange={onChange} open checkable checkStrictly />,
      );

      clickOption(container, 0, 1); // Click bamboo
      clickOption(container, 1, 0); // Click little

      // Check grandchild `fish`
      clickOption(container, 2, 0); // Click fish

      const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
      expect(checkedCheckboxes).toHaveLength(1);
      expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

      expect(onChange).toHaveBeenCalledWith([['bamboo', 'little', 'fish']], expect.anything());
    });

    it('precisely selects a non-leaf intermediate value under control', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader
          options={options}
          onChange={onChange}
          open
          checkable
          checkStrictly
          defaultValue={[['bamboo']]}
        />,
      );

      // Province `bamboo` is precisely checked alone (no auto-checked children)
      const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
      expect(checkedCheckboxes).toHaveLength(1);
      expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

      // Uncheck it
      const bambooCheckbox = container.querySelector(
        '[data-path-key="bamboo"] .rc-cascader-checkbox',
      ) as HTMLElement;
      fireEvent.click(bambooCheckbox);
      expect(onChange).toHaveBeenCalledWith([], expect.anything());
    });

    it('ignores showCheckedStrategy under checkStrictly', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader
          options={options}
          onChange={onChange}
          open
          checkable
          checkStrictly
          showCheckedStrategy={Cascader.SHOW_PARENT}
        />,
      );

      clickOption(container, 0, 1); // Click bamboo
      clickOption(container, 1, 0); // Click little

      // Check both fish and cards (children of little)
      clickOption(container, 2, 0); // fish
      clickOption(container, 2, 1); // cards

      // Under checkStrictly, strategy roll-up is bypassed: both remain, no merge to `little`.
      const checkedCheckboxes = container.querySelectorAll('.rc-cascader-checkbox-checked');
      expect(checkedCheckboxes).toHaveLength(2);
      expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

      expect(onChange).toHaveBeenLastCalledWith(
        [
          ['bamboo', 'little', 'fish'],
          ['bamboo', 'little', 'cards'],
        ],
        expect.anything(),
      );
    });

    it('missing values are preserved and removable under checkStrictly', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader
          options={options}
          onChange={onChange}
          open
          checkable
          checkStrictly
          defaultValue={[['nonexistent']]}
        />,
      );

      // Click a real parent `bamboo` (single mode already open because defaultValue exists)
      clickOption(container, 0, 1); // Click bamboo

      // Check bamboo alongside the missing value
      const bambooCheckbox = container.querySelector(
        '[data-path-key="bamboo"] .rc-cascader-checkbox',
      ) as HTMLElement;
      fireEvent.click(bambooCheckbox);

      expect(onChange).toHaveBeenLastCalledWith([['nonexistent'], ['bamboo']], expect.anything());
    });

    // https://github.com/ant-design/ant-design/issues/38049
    // checkStrictly skips `conductCheck`, so disabled-sibling conduction
    // (present in non-strict mode) must also be bypassed.
    it('disabled sibling does not trigger parent roll-up under checkStrictly', () => {
      const disabledSiblingOptions = [
        {
          label: 'Parent',
          value: 'parent',
          children: [
            { label: 'Normal', value: 'normal' },
            { label: 'Disabled', value: 'disabled', disabled: true },
          ],
        },
      ];

      // ---- checkStrictly: only the clicked leaf is checked, no parent roll-up ----
      const strictOnChange = jest.fn();
      const { container: strictContainer } = render(
        <Cascader
          options={disabledSiblingOptions}
          onChange={strictOnChange}
          open
          checkable
          checkStrictly
        />,
      );
      clickOption(strictContainer, 0, 0); // expand Parent

      // Checks `normal`; `disabled` stays unchecked, `parent` does NOT get pulled in.
      fireEvent.click(strictContainer.querySelectorAll('.rc-cascader-checkbox')[1] as HTMLElement);

      expect(strictContainer.querySelectorAll('.rc-cascader-checkbox-checked')).toHaveLength(1);
      expect(strictContainer.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();
      expect(strictOnChange).toHaveBeenLastCalledWith([['parent', 'normal']], expect.anything());

      // ---- non-strict (default SHOW_PARENT): same click rolls up to parent ----
      // because the only checkable leaf being checked makes the parent fully checked.
      const { container: nonStrictContainer } = render(
        <Cascader
          options={disabledSiblingOptions}
          open
          checkable
          // default showCheckedStrategy = SHOW_PARENT
        />,
      );
      clickOption(nonStrictContainer, 0, 0);
      fireEvent.click(
        nonStrictContainer.querySelectorAll('.rc-cascader-checkbox')[1] as HTMLElement,
      );

      // Confirms the two modes genuinely differ: non-strict collapses to parent.
      expect(nonStrictContainer.querySelectorAll('.rc-cascader-checkbox-checked')).toHaveLength(2);
    });

    it('controlled value round-trips under checkStrictly (uncheck removes exact path)', () => {
      const onChange = jest.fn();
      const { container } = render(
        <Cascader
          options={options}
          onChange={onChange}
          open
          checkable
          checkStrictly
          value={[['bamboo', 'little', 'fish']]}
        />,
      );

      // Open bamboo > little so the controlled leaf checkbox is visible.
      clickOption(container, 0, 1); // Click bamboo
      clickOption(container, 1, 0); // Click little

      // Controlled propagation renders the precise path checked, no conduction
      // to ancestors: only `fish` is checked, `bamboo`/`little` are not.
      expect(container.querySelectorAll('.rc-cascader-checkbox-checked')).toHaveLength(1);
      expect(container.querySelector('.rc-cascader-checkbox-indeterminate')).toBeFalsy();

      const fishCheckbox = container.querySelector(
        '[data-path-key="bamboo__RC_CASCADER_SPLIT__little__RC_CASCADER_SPLIT__fish"] .rc-cascader-checkbox',
      ) as HTMLElement;
      fireEvent.click(fishCheckbox);

      expect(onChange).toHaveBeenLastCalledWith([], expect.anything());
    });
  });
});
