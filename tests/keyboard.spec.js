import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Cascader from '..';
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

  [['space', KeyCode.SPACE], ['enter', KeyCode.ENTER]].forEach(([name, keyCode]) => {
    it(`${name} to open`, () => {
      wrapper.find('input').simulate('keyDown', { keyCode });
      expect(wrapper.find('.rc-cascader-menus-hidden').length).toBe(0);

      wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ESC });
      expect(wrapper.find('.rc-cascader-menus-hidden').length).toBe(1);
    });
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

  it('should call the Cascader onKeyDown callback in all cases', () => {
    const onKeyDown = jest.fn();

    wrapper = mount(
      <Cascader options={addressOptions} onChange={onChange} onKeyDown={onKeyDown} expandIcon="">
        <input readOnly />
      </Cascader>,
    );
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.DOWN });
    expect(wrapper.state().popupVisible).toBeTruthy();
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ESC });
    expect(wrapper.state().popupVisible).toBeFalsy();
    wrapper.find('input').simulate('keyDown', { keyCode: KeyCode.ENTER });

    expect(onKeyDown).toHaveBeenCalledTimes(3);
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
