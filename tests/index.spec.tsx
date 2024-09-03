import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { resetWarned } from 'rc-util/lib/warning';
import React, { useEffect, useState } from 'react';
import type { CascaderRef, BaseOptionType, CascaderProps } from '../src';
import Cascader from '../src';
import { addressOptions, addressOptionsForUneven, optionsForActiveMenuItems } from './demoOptions';
import { mount } from './enzyme';
import { toRawValues } from '../src/utils/commonUtil';
import { fireEvent, render } from '@testing-library/react';

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
    const wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    expect(wrapper.isOpen()).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();
  });

  it('should call onChange when finish select', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');

    // Menu 1
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    expect(selectedValue).toBeFalsy();

    wrapper.clickOption(0, 0);
    expect(
      wrapper.find('.rc-cascader-menu-item').first().hasClass('rc-cascader-menu-item-active'),
    ).toBeTruthy();

    // Menu 2
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus.at(1).find('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expect(wrapper.isOpen()).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    wrapper.clickOption(1, 0);
    expect(
      wrapper
        .find('.rc-cascader-menu')
        .at(1)
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-active'),
    ).toBeTruthy();

    // Menu 3
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus.at(2).find('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expect(wrapper.isOpen()).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    wrapper.clickOption(2, 0);
    expect(wrapper.isOpen()).toBeFalsy();
    expect(selectedValue.join(',')).toBe('fj,fuzhou,mawei');
  });

  it('should support showCheckedStrategy parent', () => {
    const wrapper = mount(
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
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    wrapper.clickOption(0, 2);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.clickOption(1, 0);
    wrapper.clickOption(1, 1);
    expect(selectedValue.join(',')).toBe('bj');
  });

  it('should support showCheckedStrategy child', () => {
    const wrapper = mount(
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
    wrapper.find('input').simulate('click');

    // Menu 1
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    wrapper.clickOption(0, 2);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.clickOption(1, 0);
    wrapper.clickOption(1, 1);
    expect(selectedValue[0].join(',')).toBe('bj,chaoyang');
    expect(selectedValue[1].join(',')).toBe('bj,haidian');
    expect(selectedValue.join(',')).toBe('bj,chaoyang,bj,haidian');
  });

  it('should has defaultValue', () => {
    const wrapper = mount(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        expandIcon=""
      >
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const activeMenuItems = wrapper.find('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems.at(0).text()).toBe('福建');
    expect(activeMenuItems.at(1).text()).toBe('福州');
    expect(activeMenuItems.at(2).text()).toBe('马尾');
  });

  it('should support expand previous item when hover', () => {
    const wrapper = mount(
      <Cascader expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');

    // Menu 1
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    expect(selectedValue).toBeFalsy();

    menu1Items.at(0).simulate('mouseEnter');
    jest.runAllTimers();
    wrapper.update();
    expect(
      wrapper
        .find('.rc-cascader-menu')
        .at(0)
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-active'),
    ).toBeTruthy();

    // Menu 2
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus.at(1).find('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expect(wrapper.isOpen()).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    menu2Items.at(0).simulate('mouseEnter');
    jest.runAllTimers();
    wrapper.update();
    expect(
      wrapper
        .find('.rc-cascader-menu')
        .at(1)
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-active'),
    ).toBeTruthy();

    // Menu 3
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus.at(2).find('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expect(wrapper.isOpen()).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    wrapper.clickOption(2, 0);
    expect(wrapper.isOpen()).toBeFalsy();
    expect(selectedValue.join(',')).toBe('fj,fuzhou,mawei');
  });

  it('should clear active selection when no finish select', () => {
    const wrapper = mount(
      <Cascader options={addressOptions}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    wrapper.clickOption(0, 0);
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();

    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
  });

  it('should set back to defaultValue when no finish select', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} defaultValue={['fj', 'fuzhou', 'mawei']}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    wrapper.clickOption(0, 0);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
  });

  it('should set the value on each selection', () => {
    const wrapper = mount(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        changeOnSelect
      >
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    wrapper.clickOption(0, 0);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();

    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(selectedValue.length).toBe(1);
    expect(selectedValue[0]).toBe('fj');
  });

  it('should not change value inside when it is a controlled component', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} value={['fj']}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    wrapper.clickOption(0, 0);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    wrapper.clickOption(1, 0);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    wrapper.clickOption(2, 0);
    expect(wrapper.isOpen()).toBeFalsy();

    wrapper.find('input').simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.isOpen()).toBeTruthy();
    expect(menus.length).toBe(2);
  });

  it('should be disabled', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} disabled onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    expect(wrapper.isOpen()).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeFalsy();
  });

  it('should display not found popup when there is no options', () => {
    const wrapper = mount(
      <Cascader options={[]} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(1);
    expect(wrapper.find('.rc-cascader-menu-item')).toHaveLength(1);
    expect(wrapper.find('.rc-cascader-menu-item').text()).toEqual('Not Found');

    wrapper.setProps({ notFoundContent: 'BambooLight' });
    expect(wrapper.find('.rc-cascader-menu-item').text()).toEqual('BambooLight');
  });

  it('should not display when children is empty', () => {
    const wrapper = mount(
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
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
  });

  describe('option disabled', () => {
    it('should be unselectable when option is disabled', () => {
      const newAddressOptions = [...addressOptions];
      newAddressOptions[0] = {
        ...newAddressOptions[0],
        disabled: true,
      };
      const wrapper = mount(
        <Cascader options={newAddressOptions} onChange={onChange}>
          <input readOnly />
        </Cascader>,
      );
      wrapper.find('input').simulate('click');
      let menus = wrapper.find('.rc-cascader-menu');
      expect(menus.length).toBe(1);
      const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
      expect(menu1Items.length).toBe(3);
      expect(selectedValue).toBeFalsy();

      menu1Items.at(0).simulate('click');
      expect(
        wrapper.find('.rc-cascader-menu-item').first().hasClass('rc-cascader-menu-item-disabled'),
      ).toBe(true);
      menus = wrapper.find('.rc-cascader-menu');
      expect(menus.length).toBe(1);
    });

    it('can not clear selector when disabled', () => {
      const newAddressOptions = JSON.parse(JSON.stringify(addressOptions));
      newAddressOptions[0].children[0].disabled = true;

      const wrapper = mount(
        <Cascader
          options={newAddressOptions}
          value={[
            ['fj', 'fuzhou'],
            ['bj', 'chaoyang'],
          ]}
          checkable
        />,
      );

      expect(wrapper.find('.rc-cascader-selection-item-disabled').text()).toEqual('福州');
      expect(
        wrapper
          .find('.rc-cascader-selection-item:not(.rc-cascader-selection-item-disabled)')
          .find('.rc-cascader-selection-item-content')
          .text(),
      ).toEqual('朝阳区');
    });
  });

  it('should have correct active menu items', () => {
    const wrapper = mount(
      <Cascader options={optionsForActiveMenuItems} defaultValue={['1', '2']} expandIcon="">
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    const activeMenuItems = wrapper.find('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(2);
    expect(activeMenuItems.at(0).text()).toBe('1');
    expect(activeMenuItems.at(1).text()).toBe('2');
    const menus = wrapper.find('.rc-cascader-menu');
    const activeMenuItemsInMenu1 = menus.at(0).find('.rc-cascader-menu-item-active');
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
    const wrapper = mount(<Demo />);
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);

    wrapper.clickOption(0, 0);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    jest.runAllTimers();
    wrapper.update();
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
  });

  // https://github.com/ant-design/ant-design/issues/7480
  it('should call onChange on click when expandTrigger=hover with changeOnSelect', () => {
    const wrapper = mount(
      <Cascader changeOnSelect expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);

    wrapper.clickOption(0, 0);
    expect(selectedValue[0]).toBe('fj');
    expect(wrapper.isOpen()).toBeFalsy();
  });

  it('should not call onChange on hover when expandTrigger=hover with changeOnSelect', () => {
    const wrapper = mount(
      <Cascader changeOnSelect expandTrigger="hover" options={addressOptions} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );

    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(3);
    menu1Items.at(0).simulate('mouseEnter');
    jest.runAllTimers();
    wrapper.update();
    expect(selectedValue).toBeFalsy();
    expect(wrapper.isOpen()).toBeTruthy();
  });

  it('warning popupVisible & onPopupVisibleChange & popupClassName', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onPopupVisibleChange = jest.fn();
    const wrapper = mount(
      <Cascader
        popupVisible
        onPopupVisibleChange={onPopupVisibleChange}
        popupClassName="legacy-cls"
        popupPlacement="topRight"
      />,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `onPopupVisibleChange` is deprecated. Please use `onDropdownVisibleChange` instead.',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `popupVisible` is deprecated. Please use `open` instead.',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `popupClassName` is deprecated. Please use `dropdownClassName` instead.',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `popupPlacement` is deprecated. Please use `placement` instead.',
    );

    expect(wrapper.exists('.legacy-cls')).toBeTruthy();
    expect(wrapper.find('Trigger').prop('popupPlacement')).toEqual('topRight');

    errorSpy.mockRestore();
  });

  it('should support custom expand icon(text icon)', () => {
    const wrapper = mount(
      <Cascader
        options={addressOptions}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        onChange={onChange}
        expandIcon="=>"
      >
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const activeMenuItems = wrapper.find('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems.at(0).text()).toBe('福建=>');
    expect(activeMenuItems.at(1).text()).toBe('福州=>');
    expect(activeMenuItems.at(2).text()).toBe('马尾');
  });

  it('should close popup on double click when changeOnSelect is set', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} changeOnSelect>
        <input readOnly />
      </Cascader>,
    );

    expect(wrapper.isOpen()).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.isOpen()).toBeTruthy();
    wrapper.clickOption(0, 0, 'doubleClick');
    expect(wrapper.isOpen()).toBeFalsy();
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
    const wrapper = mount(
      <Cascader options={options} popupVisible>
        <input readOnly />
      </Cascader>,
    );
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.render()).toMatchSnapshot();
  });

  it('should render custom dropdown correctly', () => {
    const wrapper = mount(
      <Cascader
        options={addressOptions}
        popupVisible
        dropdownRender={menus => (
          <div className="custom-dropdown">
            {menus}
            <hr />
            <span className="custom-dropdown-content">Hello, DropdownRender</span>
          </div>
        )}
      >
        <input readOnly />
      </Cascader>,
    );

    const customDropdown = wrapper.find('.custom-dropdown');
    expect(customDropdown.length).toBe(1);
    const customDropdownContent = wrapper.find('.custom-dropdown-content');
    expect(customDropdownContent.length).toBe(1);
    const menus = wrapper.find('.rc-cascader-dropdown');
    expect(menus.render()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/41134
  it('hover to no secondary menu should hide the previous secondary menu', () => {
    const wrapper = mount(
      <Cascader
        changeOnSelect
        expandTrigger="hover"
        options={addressOptionsForUneven}
        onChange={onChange}
      >
        <input readOnly />
      </Cascader>,
    );

    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    expect(menu1Items.length).toBe(5);
    wrapper.clickOption(0, 3, 'mouseEnter');

    const menus2 = wrapper.find('.rc-cascader-menu');
    expect(menus2.length).toBe(2);
    const menu2Items = menus2.at(1).find('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    wrapper.clickOption(1, 0, 'mouseEnter');

    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(3);
    wrapper.clickOption(1, 1, 'mouseEnter');
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(2); // should hide the previous secondary menu

    wrapper.clickOption(0, 4, 'mouseEnter');
    expect(wrapper.find('.rc-cascader-menu')).toHaveLength(1); // should hide the previous secondary menu

    jest.runAllTimers();
    wrapper.update();
    expect(selectedValue).toBeFalsy();
    expect(wrapper.isOpen()).toBeTruthy();
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
      mount(<Cascader ref={cascaderRef} />);

      cascaderRef.current?.focus();
      expect(focusTimes === 1).toBeTruthy();
    });

    it('blur', () => {
      const cascaderRef = React.createRef<CascaderRef>();
      mount(<Cascader ref={cascaderRef} />);

      cascaderRef.current?.blur();
      expect(blurTimes === 1).toBeTruthy();
    });
  });

  describe('active className', () => {
    it('expandTrigger: click', () => {
      const wrapper = mount(
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

      wrapper.clickOption(0, 0);
      wrapper.clickOption(1, 0);

      expect(wrapper.find('li.rc-cascader-menu-item-active')).toHaveLength(2);
      expect(wrapper.find('li.rc-cascader-menu-item-active').first().text()).toEqual('Bamboo');
      expect(wrapper.find('li.rc-cascader-menu-item-active').last().text()).toEqual('Little');
    });

    it('expandTrigger: hover', () => {
      const wrapper = mount(
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

      wrapper.clickOption(0, 0, 'mouseEnter');
      wrapper.clickOption(1, 0, 'mouseEnter');

      expect(wrapper.find('li.rc-cascader-menu-item-active')).toHaveLength(1);
      expect(wrapper.find('li.rc-cascader-menu-item-active').first().text()).toEqual('Bamboo');
    });

    describe('the defaultValue should be activated the first time it is opened', () => {
      (['click', 'hover'] as const).forEach(expandTrigger => {
        it(`expandTrigger: ${expandTrigger}`, () => {
          const wrapper = mount(
            <Cascader
              expandTrigger={expandTrigger}
              defaultValue={['tw', 'gaoxiong']}
              options={addressOptionsForUneven}
            >
              <input readOnly />
            </Cascader>,
          );

          wrapper.find('input').simulate('click');
          const activeItems = wrapper.find('li.rc-cascader-menu-item-active');
          expect(activeItems).toHaveLength(2);
          expect(activeItems.last().text()).toEqual('高雄');
        });
      });
    });
  });

  it('defaultValue not exist', () => {
    const wrapper = mount(<Cascader defaultValue={['not', 'exist']} />);
    expect(wrapper.find('.rc-cascader-selection-item').text()).toEqual('not / exist');
  });

  it('number value', () => {
    const onValueChange = jest.fn();
    const wrapper = mount(
      <Cascader onChange={onValueChange} options={[{ label: 'One', value: 1 }]} open />,
    );

    wrapper.clickOption(0, 0);
    expect(onValueChange).toHaveBeenCalledWith([1], expect.anything());
    expect(wrapper.find('.rc-cascader-selection-item').text()).toEqual('One');
  });

  it('empty children is last children', () => {
    const onValueChange = jest.fn();

    const wrapper = mount(
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

    wrapper.clickOption(0, 0);

    expect(onValueChange).toHaveBeenCalledWith(['parent'], expect.anything());
    expect(wrapper.find('ul.rc-cascader-menu')).toHaveLength(1);
  });

  describe('ReactNode label should not be [object]', () => {
    it('single', () => {
      const wrapper = mount(
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

      expect(wrapper.find('.rc-cascader-selection-item').text()).toEqual('Normal / Child');
    });

    it('multiple', () => {
      const wrapper = mount(
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
        />,
      );

      expect(wrapper.find('.rc-cascader-selection-item-content').first().text()).toEqual('Parent');
      expect(wrapper.find('.rc-cascader-selection-item-content').last().text()).toEqual('Child');
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

      const wrapper = mount(
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
      wrapper.unmount();
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

      const wrapper = mount(
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
      wrapper.unmount();
      spyElement.mockRestore();
    });

    it('should not scroll if no parent', () => {
      const spyElement = spyElementPrototypes(HTMLElement, {
        parentElement: {
          get: () => null,
        },
      });

      const wrapper = mount(
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
      wrapper.unmount();
      spyElement.mockRestore();
    });

    it('should support double quote in label and value', () => {
      const wrapper = mount(
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

      wrapper.find(`li[data-path-key]`).at(0).simulate('click');
      wrapper.find(`li[data-path-key]`).at(1).simulate('click');
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

      const wrapper = render(
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
      fireEvent.change(wrapper.container.querySelector('input') as HTMLElement, {
        target: { value: 'w' },
      });
      const items = wrapper.container.querySelectorAll('.rc-cascader-menu-item');
      fireEvent.mouseEnter(items[9]);
      expect(mockScrollTo).toHaveBeenCalledTimes(0);

      spyElement.mockRestore();
    });
  });

  it('not crash when value type is not array', () => {
    mount(<Cascader value={'bamboo' as any} />);
  });

  it('support custom cascader', () => {
    const wrapper = mount(<Cascader dropdownStyle={{ zIndex: 999 }} open />);
    expect(wrapper.find('.rc-cascader-dropdown').props().style?.zIndex).toBe(999);
  });

  it('`null` is a value in Cascader options should throw a warning', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => null);
    mount(
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
    expect(toRawValues()).toEqual([]);
  });

  it('nativeElement', () => {
    const cascaderRef = React.createRef<CascaderRef>();
    const { container } = render(<Cascader ref={cascaderRef} />);
    expect(cascaderRef.current?.nativeElement).toEqual(container.querySelector('.rc-cascader'));
  });
});
