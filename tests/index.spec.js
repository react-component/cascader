/* eslint-disable react/jsx-no-bind */

import React from 'react';
import { mount } from 'enzyme';
import Cascader from '../';
import {
  addressOptions,
  optionsForActiveMenuItems,
  addressOptionsForFieldNames,
} from './demoOptions';

describe('Cascader', () => {
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
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeTruthy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
  });

  it('should call onChange when finish select', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange}>
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
      wrapper
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-active'),
    ).toBe(true);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus.at(1).find('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expect(wrapper.state().popupVisible).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    menu2Items.at(0).simulate('click');
    expect(
      wrapper
        .find('.rc-cascader-menu')
        .at(1)
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-active'),
    ).toBe(true);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus.at(2).find('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expect(wrapper.state().popupVisible).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    menu3Items.at(0).simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
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
    ).toBe(true);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus.at(1).find('.rc-cascader-menu-item');
    expect(menu2Items.length).toBe(2);
    expect(wrapper.state().popupVisible).toBeTruthy();
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
    ).toBe(true);
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus.at(2).find('.rc-cascader-menu-item');
    expect(menu3Items.length).toBe(1);
    expect(wrapper.state().popupVisible).toBeTruthy();
    expect(selectedValue).toBeFalsy();

    menu3Items.at(0).simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
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
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeTruthy();
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
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeTruthy();
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
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeTruthy();
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
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');

    menu1Items.at(0).simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    const menu2Items = menus.at(1).find('.rc-cascader-menu-item');

    menu2Items.at(0).simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    const menu3Items = menus.at(2).find('.rc-cascader-menu-item');

    menu3Items.at(0).simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.state().popupVisible).toBeTruthy();
    expect(menus.length).toBe(2);
  });

  it('should be disabled', () => {
    const wrapper = mount(
      <Cascader options={addressOptions} disabled onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeFalsy();
  });

  it('should not display popup when there is no options', () => {
    const wrapper = mount(
      <Cascader options={[]} onChange={onChange}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(0);
    wrapper.find('input').simulate('click');
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(0);
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
      wrapper
        .find('.rc-cascader-menu-item')
        .first()
        .hasClass('rc-cascader-menu-item-disabled'),
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

      getPopupDOMNode() {
        return this.cascader.getPopupDOMNode();
      }

      render() {
        return (
          <Cascader
            options={addressOptions}
            value={this.state.value}
            ref={node => {
              this.cascader = node;
            }}
          >
            <input readOnly />
          </Cascader>
        );
      }
    }
    const wrapper = mount(<Demo />);
    wrapper.find('input').simulate('click');
    let menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(1);
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('click');
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
    menu1Items.at(0).simulate('click');
    expect(selectedValue[0]).toBe('fj');
    expect(wrapper.state().popupVisible).toBeFalsy();
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
    expect(wrapper.state().popupVisible).toBeTruthy();
  });

  it('should has default fieldName when props not exist labelField and valueField and childrenField', () => {
    // eslint-disable-line
    const wrapper = mount(
      <Cascader options={addressOptions}>
        <input />
      </Cascader>,
    );
    const props = wrapper.props();
    expect(props.fieldNames.label).toBe('label');
    expect(props.fieldNames.value).toBe('value');
    expect(props.fieldNames.children).toBe('children');
  });

  it('should support custom fieldNames', () => {
    const wrapper = mount(
      <Cascader
        fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
        options={addressOptionsForFieldNames}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        expandIcon=""
        popupVisible
      >
        <input />
      </Cascader>,
    );
    const props = wrapper.props();
    expect(props.fieldNames.label).toBe('name');
    expect(props.fieldNames.value).toBe('code');
    expect(props.fieldNames.children).toBe('nodes');
    const activeMenuItems = wrapper.find('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems.at(0).text()).toBe('福建');
    expect(activeMenuItems.at(1).text()).toBe('福州');
    expect(activeMenuItems.at(2).text()).toBe('马尾');
  });

  it('should works and show warning message when use typo prop name: filedNames', () => {
    // eslint-disable-next-line
    console.error = jest.fn();
    const wrapper = mount(
      <Cascader
        filedNames={{ label: 'name', value: 'code', children: 'nodes' }}
        options={addressOptionsForFieldNames}
        defaultValue={['fj', 'fuzhou', 'mawei']}
        popupVisible
        expandIcon=""
      >
        <input />
      </Cascader>,
    );
    expect(console.error).toHaveBeenCalled();
    const activeMenuItems = wrapper.find('.rc-cascader-menu-item-active');
    expect(activeMenuItems.length).toBe(3);
    expect(activeMenuItems.at(0).text()).toBe('福建');
    expect(activeMenuItems.at(1).text()).toBe('福州');
    expect(activeMenuItems.at(2).text()).toBe('马尾');
    console.error.mockClear();
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

    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('click');
    expect(wrapper.state().popupVisible).toBeTruthy();
    wrapper
      .find('li')
      .at(0)
      .simulate('doubleClick');
    expect(wrapper.state().popupVisible).toBeFalsy();
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

  // https://github.com/ant-design/ant-design/issues/9793
  it('should not trigger onBlur and onFocus when select item', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const wrapper = mount(
      <Cascader options={addressOptions} onFocus={onFocus} onBlur={onBlur}>
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('click');
    const menus = wrapper.find('.rc-cascader-menu');
    const menu1Items = menus.at(0).find('.rc-cascader-menu-item');
    menu1Items.at(0).simulate('mouseDown');
    menu1Items.at(0).simulate('click');
    jest.runAllTimers();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(0);
  });
});
