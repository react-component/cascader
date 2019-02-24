import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Cascader from '../';
import { addressOptions } from './demoOptions';

describe('Cascader', () => {
  let wrapper;
  let selectedValue;
  let menus;
  const onChange = value => {
    selectedValue = value;
  };

  beforeEach(() => {
    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="">
        <input readOnly />
      </Cascader>,
    );
  });

  afterEach(() => {
    selectedValue = null;
    menus = null;
  });

  it('should have keyboard support', () => {
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.find('.rc-cascader-menus-hidden').length).toBe(0);
    expect(menus.length).toBe(1);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.RIGHT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.RIGHT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.LEFT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.QUESTION_MARK });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.LEFT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(
      wrapper
        .find('.rc-cascader-menu-item-active')
        .at(0)
        .text(),
    ).toBe(addressOptions[0].label);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(
      wrapper
        .find('.rc-cascader-menu-item-active')
        .at(0)
        .text(),
    ).toBe(addressOptions[1].label);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
    expect(selectedValue).toEqual(['zj', 'hangzhou', 'yuhang']);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.SPACE });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.SPACE });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus'),
    ).toBe(true);
  });

  it('should have close menu when press some keys', () => {
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.LEFT });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.BACKSPACE });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ESC });
    expect(
      wrapper
        .find('.rc-cascader-menus')
        .hostNodes()
        .hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
  });

  it('should not handle keyDown events when children specify the onKeyDown', () => {
    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="">
        <input readOnly onKeyDown={() => {}} />
      </Cascader>,
    );
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.find('.rc-cascader-menus-hidden').length).toBe(0);
    expect(menus.length).toBe(0);
  });
});
