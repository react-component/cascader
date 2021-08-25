import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Cascader from '..';
import { addressOptions } from './demoOptions';

describe('Cascader.Keyboard', () => {
  let wrapper;
  let selectedValue;
  let menus;
  const onChange = value => {
    selectedValue = value;
  };

  beforeEach(() => {
    // TODO: <Cascader><input /></Cascader> should also handle keyboard
    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
    );
  });

  afterEach(() => {
    selectedValue = null;
    menus = null;
  });

  [
    // Space
    ['space', KeyCode.SPACE],
    // Enter
    ['enter', KeyCode.ENTER],
  ].forEach(([name, which]) => {
    it(`${name} to open`, () => {
      wrapper.find('input').simulate('keyDown', { which });
      expect(wrapper.isOpen()).toBeTruthy();

      wrapper.find('input').simulate('keyDown', { which: KeyCode.ESC });
      expect(wrapper.isOpen()).toBeFalsy();
    });
  });

  it('should have keyboard support', () => {
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.isOpen()).toBeTruthy();
    expect(menus.length).toBe(1);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.LEFT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.QUESTION_MARK });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(3);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.LEFT });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(wrapper.find('.rc-cascader-menu-item-active').at(0).text()).toBe(
      addressOptions[0].label,
    );
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(menus.length).toBe(2);
    expect(wrapper.find('.rc-cascader-menu-item-active').at(0).text()).toBe(
      addressOptions[1].label,
    );
    wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });
    expect(wrapper.isOpen()).toBeFalsy();
    expect(selectedValue).toEqual(['zj', 'hangzhou', 'yuhang']);
  });

  it.only('should have close menu when press some keys', () => {
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.isOpen()).toBeTruthy();
    wrapper.find('input').simulate('keyDown', { which: KeyCode.LEFT });
    expect(wrapper.isOpen()).toBeFalsy();
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(
      wrapper.find('.rc-cascader-menus').hostNodes().hasClass('rc-cascader-menus-hidden'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.BACKSPACE });
    expect(
      wrapper.find('.rc-cascader-menus').hostNodes().hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(
      wrapper.find('.rc-cascader-menus').hostNodes().hasClass('rc-cascader-menus-hidden'),
    ).toBe(false);
    wrapper.find('input').simulate('keyDown', { which: KeyCode.RIGHT });
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ESC });
    expect(
      wrapper.find('.rc-cascader-menus').hostNodes().hasClass('rc-cascader-menus-hidden'),
    ).toBe(true);
  });

  it('should call the Cascader onKeyDown callback in all cases', () => {
    const onKeyDown = jest.fn();

    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} onKeyDown={onKeyDown} expandIcon="">
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    expect(wrapper.state().popupVisible).toBeTruthy();
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ESC });
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('keyDown', { which: KeyCode.ENTER });

    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });

  it('should not handle keyDown events when children specify the onKeyDown', () => {
    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="">
        <input readOnly onKeyDown={() => {}} />
      </Cascader>,
    );
    wrapper.find('input').simulate('keyDown', { which: KeyCode.DOWN });
    menus = wrapper.find('.rc-cascader-menu');
    expect(wrapper.isOpen()).toBeTruthy();
    expect(menus.length).toBe(0);
  });
});
