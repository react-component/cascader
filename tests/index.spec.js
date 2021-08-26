/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { resetWarned } from 'rc-util/lib/warning';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { mount } from 'enzyme';
import Cascader from '..';
import { addressOptions, optionsForActiveMenuItems } from './demoOptions';

describe('Cascader.Basic', () => {
  let selectedValue;
  const onChange = function onChange(value) {
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
    let menus = wrapper.find('.rc-cascader-menu');
    wrapper.clickOption(0, 0);
    menus = wrapper.find('.rc-cascader-menu');
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
    class Demo extends React.Component {
      state = {
        value: [],
      };

      componentDidMount() {
        this.timeout = setTimeout(() => {
          this.setState({
            value: [],
          });
        }, 10);
      }

      componentWillUnmount() {
        clearTimeout(this.timeout);
      }

      render() {
        return (
          <Cascader options={addressOptions} value={this.state.value}>
            <input readOnly />
          </Cascader>
        );
      }
    }
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

  it('warning popupVisible & onPopupVisibleChange', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onPopupVisibleChange = jest.fn();
    mount(<Cascader popupVisible onPopupVisibleChange={onPopupVisibleChange} />);

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `onPopupVisibleChange` is deprecated. Please use `onDropdownVisibleChange` instead.',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `popupVisible` is deprecated. Please use `open` instead.',
    );

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

  describe('loadData', () => {
    it('basic load', () => {
      const loadData = jest.fn();
      const wrapper = mount(
        <Cascader
          loadingIcon={<div className="loading-icon" />}
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
              isLeaf: false,
            },
          ]}
          loadData={loadData}
          open
        />,
      );

      wrapper.find('.rc-cascader-menu-item-content').first().simulate('click');
      expect(wrapper.exists('.loading-icon')).toBeTruthy();
      expect(loadData).toHaveBeenCalledWith([
        expect.objectContaining({
          value: 'bamboo',
        }),
      ]);

      // Fill data
      wrapper.setProps({
        options: [
          {
            label: 'Bamboo',
            value: 'bamboo',
            isLeaf: false,
            children: [],
          },
        ],
      });
      wrapper.update();
      expect(wrapper.exists('.loading-icon')).toBeFalsy();
    });

    // https://github.com/ant-design/ant-design/issues/9084
    it('should trigger loadData when expandTrigger is hover', () => {
      const options = [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          isLeaf: false,
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          isLeaf: false,
        },
      ];
      const loadData = jest.fn();
      const wrapper = mount(
        <Cascader options={options} loadData={loadData} changeOnSelect expandTrigger="hover">
          <input readOnly />
        </Cascader>,
      );
      wrapper.find('input').simulate('click');
      const menus = wrapper.find('.rc-cascader-menu');
      const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
      menu1Items.at(0).simulate('mouseEnter');
      jest.runAllTimers();
      expect(loadData).toHaveBeenCalled();
    });
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

  describe('focus test', () => {
    let domSpy;
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
      const cascaderRef = React.createRef();
      mount(<Cascader ref={cascaderRef} />);

      cascaderRef.current.focus();
      expect(focusTimes === 1).toBeTruthy();
    });

    it('blur', () => {
      const cascaderRef = React.createRef();
      mount(<Cascader ref={cascaderRef} />);

      cascaderRef.current.blur();
      expect(blurTimes === 1).toBeTruthy();
    });
  });
});
