import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React, { useEffect, useState } from 'react';
import type { CascaderRef, BaseOptionType, CascaderProps } from '../src';
import Cascader from '../src';
import { addressOptions, addressOptionsForUneven, optionsForActiveMenuItems } from './demoOptions';
import * as commonUtil from '../src/utils/commonUtil';
import { act, fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import { expectOpen, selectOption, isOpen, clickOption } from './util';

describe('Cascader.Basic', () => {
  let selectedValue: any;
  const onChange: CascaderProps<BaseOptionType>['onChange'] = function onChange(value) {
    selectedValue = value;
  };
  const onMultipleChange: CascaderProps<BaseOptionType, 'value', true>['onChange'] = value => {
    selectedValue = value;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    selectedValue = null;
    jest.useRealTimers();
  });

  it('should toggle select panel when click it', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    expectOpen(container, false);

    fireEvent.mouseDown(container.querySelector('input')!);
    fireEvent.mouseUp(container.querySelector('input')!);
    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, true);

    fireEvent.mouseDown(container.querySelector('input')!);
    fireEvent.mouseUp(container.querySelector('input')!);
    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, false);
  });

  it('should call onChange when finish select', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);

    // Menu 1
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 0, 0);
    expect(
      container.querySelector('.rc-cascader-menu-item')!.classList.contains('rc-cascader-menu-item-active')
    ).toBeTruthy();

    // Menu 2
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus[1].querySelectorAll('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expectOpen(container, true);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 1, 0);
    expect(
      container
        .querySelectorAll('.rc-cascader-menu')[1]
        .querySelector('.rc-cascader-menu-item')!
        .classList.contains('rc-cascader-menu-item-active')
    ).toBeTruthy();

    // Menu 3
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus[2].querySelectorAll('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expectOpen(container, true);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 2, 0);
    expectOpen(container, false);
    expect(selectedValue.join(',')).toBe('fj,fuzhou,mawei');
  });

  it('should support showCheckedStrategy parent', () => {
    const { container } = render(
      <Cascader
        checkable
        changeOnSelect
        options={addressOptions}
        onChange={onMultipleChange}
        showCheckedStrategy={'SHOW_PARENT'}
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    clickOption(container, 0, 2);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    clickOption(container, 1, 0);
    clickOption(container, 1, 1);
    expect(selectedValue.join(',')).toBe('bj');
  });

  it('should support showCheckedStrategy child', () => {
    const { container } = render(
      <Cascader
        checkable
        changeOnSelect
        options={addressOptions}
        onChange={onMultipleChange}
        showCheckedStrategy={'SHOW_CHILD'}
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);

    // Menu 1
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    clickOption(container, 0, 2);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    clickOption(container, 1, 0);
    clickOption(container, 1, 1);
    expect(selectedValue[0].join(',')).toBe('bj,chaoyang');
    expect(selectedValue[1].join(',')).toBe('bj,haidian');
    expect(selectedValue.join(',')).toBe('bj,chaoyang,bj,haidian');
  });

  it('should has defaultValue', () => {
    const { container } = render(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        expandIcon=""
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const activeMenuItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems[0].textContent).toBe('福建');
    expect(activeMenuItems[1].textContent).toBe('福州');
    expect(activeMenuItems[2].textContent).toBe('马尾');
  });

  it('should support expand previous item when hover', () => {
    const { container } = render(
      <Cascader expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);

    // Menu 1
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 0, 0, 'mouseEnter');
    act(() => {
      jest.runAllTimers();
    });
    expect(
      container
        .querySelectorAll('.rc-cascader-menu')[0]
        .querySelector('.rc-cascader-menu-item')!
        .classList.contains('rc-cascader-menu-item-active')
    ).toBeTruthy();

    // Menu 2
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus[1].querySelectorAll('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expectOpen(container, true);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 1, 0, 'mouseEnter');
    act(() => {
      jest.runAllTimers();
    });
    expect(
      container
        .querySelectorAll('.rc-cascader-menu')[1]
        .querySelector('.rc-cascader-menu-item')!
        .classList.contains('rc-cascader-menu-item-active')
    ).toBeTruthy();

    // Menu 3
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus[2].querySelectorAll('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expectOpen(container, true);
    expect(selectedValue).toBeFalsy();

    selectOption(container, 2, 0);
    expectOpen(container, false);
    expect(selectedValue.join(',')).toBe('fj,fuzhou,mawei');
  });

  it('should clear active selection when no finish select', () => {
    const { container } = render(
      <Cascader options={addressOptions}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    selectOption(container, 0, 0);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, false);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, true);

    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
  });

  it('should set back to defaultValue when no finish select', () => {
    const { container } = render(
      <Cascader options={addressOptions} defaultValue={['fj', 'fuzhou', 'mawei']}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    selectOption(container, 0, 0);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, false);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, true);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);
  });

  it('should set the value on each selection', () => {
    const { container } = render(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        changeOnSelect
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    selectOption(container, 0, 0);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, false);

    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, true);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(selectedValue.length).toBe(1);
    expect(selectedValue[0]).toBe('fj');
  });

  it('should not change value inside when it is a controlled component', () => {
    const { container } = render(
      <Cascader options={addressOptions} value={['fj']}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    selectOption(container, 0, 0);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    selectOption(container, 1, 0);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    selectOption(container, 2, 0);
    expectOpen(container, false);

    fireEvent.click(container.querySelector('input')!);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expectOpen(container, true);
    expect(menus.length).toBe(2);
  });

  it('should be disabled', () => {
    const { container } = render(
      <Cascader options={addressOptions} disabled onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    expect(isOpen(container)).toBeFalsy();
    fireEvent.click(container.querySelector('input')!);
    expect(isOpen(container)).toBeFalsy();
    fireEvent.click(container.querySelector('input')!);
    expect(isOpen(container)).toBeFalsy();
  });

  it('should display not found popup when there is no options', () => {
    const { container, rerender } = render(
      <Cascader options={[]} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    expect(isOpen(container)).toBeTruthy();
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(1);
    expect(container.querySelectorAll('.rc-cascader-menu-item')).toHaveLength(1);
    expect(container.querySelector('.rc-cascader-menu-item')!.textContent).toEqual('Not Found');

    rerender(
      <Cascader options={[]} onChange={onChange} notFoundContent="BambooLight">
        <input readOnly />
      </Cascader>
    );
    expect(container.querySelector('.rc-cascader-menu-item')!.textContent).toEqual('BambooLight');
  });

  it('should not display when children is empty', () => {
    const { container } = render(
      <Cascader
        options={[
          {
            label: '福建',
            value: 'fj',
            children: [],
          },
        ]}
        onChange={onChange}
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
  });

  describe('option disabled', () => {
    it('should be unselectable when option is disabled', () => {
      const newAddressOptions = [...addressOptions];
      newAddressOptions[0] = {
        ...newAddressOptions[0],
        disabled: true,
      };
      const { container } = render(
        <Cascader options={newAddressOptions} onChange={onChange}>
          <input readOnly />
        </Cascader>,
      );
      fireEvent.click(container.querySelector('input')!);
      let menus = container.querySelectorAll('.rc-cascader-menu');
      expect(menus.length).toBe(1);
      const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
      expect(menu1Items.length).toBe(3);
      expect(selectedValue).toBeFalsy();

      fireEvent.click(menu1Items[0]);
      expect(
        container.querySelector('.rc-cascader-menu-item')!.classList.contains('rc-cascader-menu-item-disabled'),
      ).toBe(true);
      menus = container.querySelectorAll('.rc-cascader-menu');
      expect(menus.length).toBe(1);
    });

    it('can not clear selector when disabled', () => {
      const newAddressOptions = JSON.parse(JSON.stringify(addressOptions));
      newAddressOptions[0].children[0].disabled = true;

      const { container } = render(
        <Cascader
          options={newAddressOptions}
          value={[
            ['fj', 'fuzhou'],
            ['bj', 'chaoyang'],
          ]}
          checkable
        />,
      );

      expect(container.querySelector('.rc-cascader-selection-item-disabled')!.textContent).toEqual('福州');
      expect(
        container
          .querySelector('.rc-cascader-selection-item:not(.rc-cascader-selection-item-disabled)')!
          .querySelector('.rc-cascader-selection-item-content')!
          .textContent,
      ).toEqual('朝阳区');
    });
  });

  it('should have correct active menu items', () => {
    const { container } = render(
      <Cascader options={optionsForActiveMenuItems} defaultValue={['1', '2']} expandIcon="">
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    const activeMenuItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(2);
    expect(activeMenuItems[0].textContent).toBe('1');
    expect(activeMenuItems[1].textContent).toBe('2');
    const menus = container.querySelectorAll('.rc-cascader-menu');
    const activeMenuItemsInMenu1 = menus[0].querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItemsInMenu1.length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/5666
  it('should have not change active value when value is not changed', () => {
    const Demo = () => {
      const [value, setValue] = useState([]);

      // const  timeout = null;
      useEffect(() => {
        const timeout = setTimeout(() => {
          setValue([]);
        }, 10);
        return () => {
          clearTimeout(timeout);
        };
      }, []);

      return (
        <Cascader options={addressOptions} value={value}>
          <input readOnly />
        </Cascader>
      );
    };
    const { container } = render(<Demo />);
    fireEvent.click(container.querySelector('input')!);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);

    clickOption(container, 0, 0);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    jest.runAllTimers();
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);
  });

  // https://github.com/ant-design/ant-design/issues/7480
  it('should call onChange on click when expandTrigger=hover with changeOnSelect', () => {
    const { container } = render(
      <Cascader changeOnSelect expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);

    selectOption(container, 0, 0);
    expect(selectedValue[0]).toBe('fj');
    expectOpen(container, false);
  });

  it('should not call onChange on hover when expandTrigger=hover with changeOnSelect', () => {
    const { container } = render(
      <Cascader changeOnSelect expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    fireEvent.mouseEnter(menu1Items[0]);
    jest.runAllTimers();
    expect(selectedValue).toBeFalsy();
    expect(isOpen(container)).toBeTruthy();
  });

  it('should support custom expand icon(text icon)', () => {
    const { container } = render(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        expandIcon="=>"
      >
        <input readOnly />
      </Cascader>,
    );
    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const activeMenuItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems[0].textContent).toBe('福建=>');
    expect(activeMenuItems[1].textContent).toBe('福州=>');
    expect(activeMenuItems[2].textContent).toBe('马尾');
  });

  it('should close popup on double click when changeOnSelect is set', () => {
    const { container } = render(
      <Cascader options={addressOptions} changeOnSelect>
        <input readOnly />
      </Cascader>,
    );

    expectOpen(container, false);
    fireEvent.click(container.querySelector('input')!);
    expectOpen(container, true);
    selectOption(container, 0, 0, 'doubleClick');
    expectOpen(container, false);
  });

  // https://github.com/ant-design/ant-design/issues/9793
  it('should not trigger onBlur and onFocus when select item', () => {
    // This function is handled by `rc-select` instead
  });

  // https://github.com/ant-design/ant-design/issues/18713
  it('should not show title when title is falsy', () => {
    const options = [
      {
        value: '1',
        label: '1',
        title: '',
      },
      {
        value: '2',
        label: '2',
        title: undefined,
      },
      {
        value: '3',
        label: '3',
      },
      {
        value: '4',
        label: '4',
        title: 'title',
      },
    ];
    const { container } = render(
      <Cascader options={options} open>
        <input readOnly />
      </Cascader>,
    );
    const menus = container.querySelector('.rc-cascader-menu');
    expect(menus).toMatchSnapshot();
  });

  it('should render custom popup correctly', () => {
    const { container } = render(
      <Cascader
        options={addressOptions}
        open
        popupRender={menus => (
          <div className="custom-popup">
            {menus}
            <hr />
            <span className="custom-popup-content">Hello, popupRender</span>
          </div>
        )}
      >
        <input readOnly />
      </Cascader>,
    );

    const customPopup = container.querySelectorAll('.custom-popup');
    expect(customPopup.length).toBe(1);
    const customPopupContent = container.querySelectorAll('.custom-popup-content');
    expect(customPopupContent.length).toBe(1);
    const menus = container.querySelector('.rc-cascader-dropdown');
    expect(menus).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/41134
  it('hover to no secondary menu should hide the previous secondary menu', () => {
    const { container } = render(
      <Cascader
        changeOnSelect
        expandTrigger="hover"
        options={addressOptionsForUneven}
        onChange={onChange}
      >
        <input readOnly />
      </Cascader>,
    );

    fireEvent.click(container.querySelector('input')!);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus[0].querySelectorAll('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(5);
    clickOption(container, 0, 3, 'mouseEnter');

    const menus2 = container.querySelectorAll('.rc-cascader-menu');
    expect(menus2.length).toBe(2);
    const menu2Items = menus2[1].querySelectorAll('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    clickOption(container, 1, 0, 'mouseEnter');

    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(3);
    clickOption(container, 1, 1, 'mouseEnter');
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(2); // should hide the previous secondary menu

    clickOption(container, 0, 4, 'mouseEnter');
    expect(container.querySelectorAll('.rc-cascader-menu')).toHaveLength(1); // should hide the previous secondary menu

    jest.runAllTimers();
    expect(selectedValue).toBeFalsy();
    expect(isOpen(container)).toBeTruthy();
  });

  describe('focus test', () => {
    let domSpy: any;
    let focusTimes = 0;
    let blurTimes = 0;

    beforeAll(() => {
      domSpy = spyElementPrototypes(HTMLElement, {
        focus: () => {
          focusTimes += 1;
        },
        blur: () => {
          blurTimes += 1;
        },
      });
    });

    beforeEach(() => {
      focusTimes = 0;
      blurTimes = 0;
    });

    afterAll(() => {
      domSpy.mockRestore();
    });

    it('focus', () => {
      const cascaderRef = React.createRef<CascaderRef>();
      render(<Cascader ref={cascaderRef} />);

      cascaderRef.current?.focus();
      expect(focusTimes === 1).toBeTruthy();
    });

    it('blur', () => {
      const cascaderRef = React.createRef<CascaderRef>();
      render(<Cascader ref={cascaderRef} />);

      cascaderRef.current?.blur();
      expect(blurTimes === 1).toBeTruthy();
    });
  });

  describe('active className', () => {
    it('expandTrigger: click', () => {
      const { container } = render(
        <Cascader
          open
          expandIcon=""
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
              children: [
                {
                  label: 'Little',
                  value: 'little',
                },
              ],
            },
          ]}
        />,
      );

      clickOption(container, 0, 0);
      clickOption(container, 1, 0);

      expect(container.querySelectorAll('li.rc-cascader-menu-item-active')).toHaveLength(2);
      expect(container.querySelectorAll('li.rc-cascader-menu-item-active')[0].textContent).toEqual('Bamboo');
      expect(container.querySelectorAll('li.rc-cascader-menu-item-active')[1].textContent).toEqual('Little');
    });

    it('expandTrigger: hover', () => {
      const { container } = render(
        <Cascader
          open
          expandIcon=""
          expandTrigger="hover"
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
              children: [
                {
                  label: 'Little',
                  value: 'little',
                },
              ],
            },
          ]}
        />,
      );

      clickOption(container, 0, 0, 'mouseEnter');
      clickOption(container, 1, 0, 'mouseEnter');

      expect(container.querySelectorAll('li.rc-cascader-menu-item-active')).toHaveLength(1);
      expect(container.querySelectorAll('li.rc-cascader-menu-item-active')[0].textContent).toEqual('Bamboo');
    });

    describe('the defaultValue should be activated the first time it is opened', () => {
      (['click', 'hover'] as const).forEach(expandTrigger => {
        it(`expandTrigger: ${expandTrigger}`, () => {
          const { container } = render(
            <Cascader
              expandTrigger={expandTrigger}
              defaultValue={['tw', 'gaoxiong']}
              options={addressOptionsForUneven}
            >
              <input readOnly />
            </Cascader>,
          );

          fireEvent.click(container.querySelector('input')!);
          const activeItems = container.querySelectorAll('li.rc-cascader-menu-item-active');
          expect(activeItems).toHaveLength(2);
          expect(activeItems[1].textContent).toEqual('高雄');
        });
      });
    });
  });

  it('defaultValue not exist', () => {
    const { container } = render(<Cascader defaultValue={['not', 'exist']} />);
    expect(container.querySelector('.rc-cascader-content-value')!.textContent).toEqual('not / exist');
  });

  it('number value', () => {
    const onValueChange = jest.fn();
    const { container } = render(
      <Cascader onChange={onValueChange} options={[{ label: 'One', value: 1 }]} open />,
    );

    clickOption(container, 0, 0);
    expect(onValueChange).toHaveBeenCalledWith([1], expect.anything());
    expect(container.querySelector('.rc-cascader-content-value')!.textContent).toEqual('One');
  });

  it('empty children is last children', () => {
    const onValueChange = jest.fn();

    const { container } = render(
      <Cascader
        open
        onChange={onValueChange}
        options={[
          {
            label: 'parent',
            value: 'parent',
            children: [],
          },
        ]}
      />,
    );

    clickOption(container, 0, 0);

    expect(onValueChange).toHaveBeenCalledWith(['parent'], expect.anything());
    expect(container.querySelectorAll('ul.rc-cascader-menu')).toHaveLength(1);
  });

  describe('ReactNode label should not be [object]', () => {
    it('single', () => {
      const { container } = render(
        <Cascader
          options={[
            {
              label: 'Normal',
              value: 'normal',
              children: [
                {
                  label: <span>Child</span>,
                  value: 'child',
                },
                {
                  label: 'Child2',
                  value: 'child2',
                },
              ],
            },
          ]}
          value={['normal', 'child']}
        />,
      );

      expect(container.querySelector('.rc-cascader-content-value')!.textContent).toEqual('Normal / Child');
    });

    it('multiple', () => {
      const onTypeChange: (
        values: string[][],
        options: { label: React.ReactNode; value: string }[][],
      ) => void = jest.fn();

      const { container } = render(
        <Cascader
          options={[
            { label: <span>Parent</span>, value: 'parent' },
            {
              label: 'Normal',
              value: 'normal',
              children: [
                {
                  label: <span>Child</span>,
                  value: 'child',
                },
                {
                  label: 'Child2',
                  value: 'child2',
                },
              ],
            },
          ]}
          value={[['parent'], ['normal', 'child']]}
          checkable
          onChange={onTypeChange}
        />,
      );

      const items = container.querySelectorAll('.rc-cascader-selection-item-content');
      expect(items[0].textContent).toEqual('Parent');
      expect(items[1].textContent).toEqual('Child');
    });
  });

  describe('open should auto scroll to position', () => {
    let spyScroll: ReturnType<typeof spyElementPrototypes>;
    const mockScrollTo = jest.fn();

    beforeAll(() => {
      spyScroll = spyElementPrototypes(HTMLElement, {
        scrollTo: mockScrollTo,
      });
    });

    afterEach(() => {
      mockScrollTo.mockRestore();
    });

    afterAll(() => {
      spyScroll.mockRestore();
    });

    it('work to scroll up', () => {
      let getOffesetTopTimes = 0;
      const spyElement = spyElementPrototypes(HTMLElement, {
        offsetTop: {
          get: () => (getOffesetTopTimes++ % 2 === 0 ? 10 : 0),
        },
        scrollTop: {
          get: () => 20,
        },
      });

      const { unmount } = render(
        <Cascader
          fieldNames={{ value: 'label' }}
          options={[
            {
              label: 'bamboo',
            },
          ]}
          defaultValue={['bamboo']}
          open
        />,
      );
      expect(mockScrollTo).toBeCalledWith(undefined, { top: 10 });
      unmount();
      spyElement.mockRestore();
    });

    it('work to scroll down', () => {
      let getOffesetTopTimes = 0;
      const spyElement = spyElementPrototypes(HTMLElement, {
        offsetTop: {
          get: () => (getOffesetTopTimes++ % 2 === 0 ? 100 : 0),
        },
        scrollTop: {
          get: () => 0,
        },
        offsetHeight: {
          get: () => 10,
        },
      });

      const { unmount } = render(
        <Cascader
          fieldNames={{ value: 'label' }}
          options={[
            {
              label: 'bamboo',
            },
          ]}
          defaultValue={['bamboo']}
          open
        />,
      );
      expect(mockScrollTo).toBeCalledWith(undefined, { top: 100 });
      unmount();
      spyElement.mockRestore();
    });

    it('should not scroll if no parent', () => {
      const spyElement = spyElementPrototypes(HTMLElement, {
        parentElement: {
          get: () => null,
        },
      });

      const { unmount } = render(
        <Cascader
          fieldNames={{ value: 'label' }}
          options={[
            {
              label: 'bamboo',
            },
          ]}
          defaultValue={['bamboo']}
          open
        />,
      );
      expect(mockScrollTo).not.toHaveBeenCalled();
      unmount();
      spyElement.mockRestore();
    });

    it('should support double quote in label and value', () => {
      const { container } = render(
        <Cascader
          options={[
            {
              label: 'bamboo "',
              value: 'bamboo "',
            },
            {
              // prettier-ignore
              label: 'bamboo \"',
              // prettier-ignore
              value: 'bamboo \"',
            },
          ]}
          open
        />,
      );

      const items = container.querySelectorAll(`li[data-path-key]`);
      fireEvent.click(items[0]);
      fireEvent.click(items[1]);
    });

    it('hover + search', () => {
      let getOffesetTopTimes = 0;
      const spyElement = spyElementPrototypes(HTMLElement, {
        offsetTop: {
          get: () => (getOffesetTopTimes++ % 2 === 0 ? 100 : 0),
        },
        scrollTop: {
          get: () => 0,
        },
        offsetHeight: {
          get: () => 10,
        },
      });

      const { container } = render(
        <Cascader
          expandTrigger="hover"
          options={[
            {
              label: 'Women Clothing',
              value: '1',
              children: [
                {
                  label: 'Women Tops, Blouses & Tee',
                  value: '11',
                  children: [
                    {
                      label: 'Women T-Shirts',
                      value: '111',
                    },
                    {
                      label: 'Women Tops',
                      value: '112',
                    },
                    {
                      label: 'Women Tank Tops & Camis',
                      value: '113',
                    },
                    {
                      label: 'Women Blouses',
                      value: '114',
                    },
                  ],
                },
                {
                  label: 'Women Suits',
                  value: '2',
                  children: [
                    {
                      label: 'Women Suit Pants',
                      value: '21',
                    },
                    {
                      label: 'Women Suit Sets',
                      value: '22',
                    },
                    {
                      label: 'Women Blazers',
                      value: '23',
                    },
                  ],
                },
              ],
            },
          ]}
          showSearch
          checkable
          open
        />,
      );
      fireEvent.change(container.querySelector('input') as HTMLElement, {
        target: { value: 'w' },
      });
      const items = container.querySelectorAll('.rc-cascader-menu-item');
      fireEvent.mouseEnter(items[9]);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);

      spyElement.mockRestore();
    });

    it('should scroll into view when navigating with keyboard', () => {
      const { container } = render(
        <Cascader
          options={Array.from({ length: 20 }).map((_, index) => ({
            value: `item-${index}`,
            label: `item-${index}`,
          }))}
          open
        />,
      );

      const input = container.querySelector('input')!;
      fireEvent.focus(input);

      const spy = jest.spyOn(commonUtil, 'scrollIntoParentView');
      fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: KeyCode.DOWN });

      const targetElement = container.querySelector('.rc-cascader-menu-item-active')!;
      expect(spy).toHaveBeenCalledWith(targetElement);
      spy.mockRestore();
    });
  });

  it('not crash when value type is not array', () => {
    render(<Cascader value={'bamboo' as any} />);
  });

  it('support custom cascader', () => {
    const { container } = render(<Cascader popupStyle={{ zIndex: 999 }} open />);
    const dropdown = container.querySelector('.rc-cascader-dropdown');
    expect(dropdown).toHaveStyle({ zIndex: '999' });
  });

  it('`null` is a value in Cascader options should throw a warning', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    render(
      <Cascader
        options={[
          {
            label: '四川',
            value: 'sc',
            children: [
              {
                label: '成都',
                value: 'cd',
                children: [
                  {
                    label: '天府新区',
                    value: null,
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
  it('toRawValues undefined', () => {
    expect(commonUtil.toRawValues()).toEqual([]);
  });

  it('nativeElement', () => {
    const cascaderRef = React.createRef<CascaderRef>();
    const { container } = render(<Cascader ref={cascaderRef} />);
    expect(cascaderRef.current?.nativeElement).toEqual(container.querySelector('.rc-cascader'));
  });

  it('support aria-* and data-*', () => {
    const options: CascaderProps['options'] = [
      {
        label: '福建',
        value: 'fj',
        'aria-label': '福建',
        'aria-labelledby': 'fj',
        'data-type': 'fj',
        children: [
          {
            label: '福州',
            value: 'fuzhou',
            children: [
              {
                label: '马尾',
                value: 'mawei',
              },
            ],
          },
          {
            label: '泉州',
            value: 'quanzhou',
          },
        ],
      },
    ];
    const { container } = render(<Cascader options={options} />);
    const item = container.querySelector('.rc-cascader-menu-item');
    if (item) {
      expect(item.getAttribute('aria-label')).toBe('福建');
      expect(item.getAttribute('aria-labelledby')).toBe('fj');
      expect(item.getAttribute('data-type')).toBe('fj');
    }
  });
});
