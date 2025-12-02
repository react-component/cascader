import { fireEvent, render } from '@testing-library/react';
import KeyCode from '@rc-component/util/lib/KeyCode';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import { addressOptions } from './demoOptions';
import React from 'react';
import { keyDown, isOpen } from './util';

describe('Cascader.Keyboard', () => {
  let selectedValue: any;
  let selectedOptions: any;
  const onChange: CascaderProps['onChange'] = (value, options) => {
    selectedValue = value;
    selectedOptions = options;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    selectedValue = null;
    selectedOptions = null;
  });

  (
    [
      // Space
      ['space', KeyCode.SPACE],
      // Enter
      ['enter', KeyCode.ENTER],
    ] as [string, number][]
  ).forEach(([name, which]) => {
    it(`${name} to open`, () => {
      const { container } = render(
        <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
      );
      keyDown(container, which);
      // Check if dropdown is open
      jest.advanceTimersByTime(100000);
      expect(isOpen(container)).toBeTruthy();

      keyDown(container, KeyCode.ESC);
      // Check if dropdown is closed
      jest.advanceTimersByTime(100000);
      expect(isOpen(container)).toBeFalsy();
    });
  });

  it('should have keyboard support', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
    );

    keyDown(container, KeyCode.DOWN);
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(1);

    keyDown(container, KeyCode.DOWN);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    keyDown(container, KeyCode.RIGHT);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    keyDown(container, KeyCode.RIGHT);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    keyDown(container, KeyCode.LEFT);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    keyDown(container, KeyCode.QUESTION_MARK);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(3);

    keyDown(container, KeyCode.LEFT);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    const activeItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeItems[0].textContent).toBe(addressOptions[0].label);

    keyDown(container, KeyCode.DOWN);
    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus.length).toBe(2);

    const updatedActiveItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(updatedActiveItems[0].textContent).toBe(addressOptions[1].label);

    keyDown(container, KeyCode.RIGHT);
    keyDown(container, KeyCode.RIGHT);
    keyDown(container, KeyCode.ENTER);

    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();
    expect(selectedValue).toEqual(['zj', 'hangzhou', 'yuhang']);
    expect(selectedOptions).toEqual([
      addressOptions[1],
      addressOptions[1]?.children?.[0],
      addressOptions[1]?.children?.[0]?.children?.[0],
    ]);
  });

  it('enter on search', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
    );
    const input = container.querySelector('input')!;

    fireEvent.change(input, { target: { value: '余杭' } });
    keyDown(container, KeyCode.DOWN);
    keyDown(container, KeyCode.ENTER);

    expect(selectedValue).toEqual(['zj', 'hangzhou', 'yuhang']);
    expect(selectedOptions).toEqual([
      addressOptions[1],
      addressOptions[1]?.children?.[0],
      addressOptions[1]?.children?.[0]?.children?.[0],
    ]);
  });
  it('enter on search when has same sub key', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
    );
    const input = container.querySelector('input')!;

    fireEvent.change(input, { target: { value: '福' } });
    keyDown(container, KeyCode.DOWN);
    let activeItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeItems.length).toBe(1);
    let activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('福建 / 福州 / 马尾');

    keyDown(container, KeyCode.DOWN);
    activeItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeItems.length).toBe(1);
    activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('福建 / 泉州');

    keyDown(container, KeyCode.DOWN);
    activeItems = container.querySelectorAll('.rc-cascader-menu-item-active');
    expect(activeItems.length).toBe(1);
    activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('浙江 / 福州 / 马尾');
  });

  it('rtl', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} direction="rtl" />,
    );
    const input = container.querySelector('input')!;

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.DOWN);
    let activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('福建');

    keyDown(container, KeyCode.LEFT);
    activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('福州');

    keyDown(container, KeyCode.RIGHT);
    activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents[activeContents.length - 1].textContent).toEqual('福建');

    keyDown(container, KeyCode.RIGHT);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();
  });

  describe('up', () => {
    it('Select last enabled', () => {
      const { container } = render(
        <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
      );
      const input = container.querySelector('input')!;

      keyDown(container, KeyCode.ENTER);
      // Check if dropdown is open
      jest.advanceTimersByTime(100000);
      expect(isOpen(container)).toBeTruthy();

      keyDown(container, KeyCode.UP);
      const activeContents = container.querySelectorAll(
        '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
      );
      expect(activeContents[activeContents.length - 1].textContent).toEqual('北京');
    });

    it('ignore disabled item', () => {
      const { container } = render(
        <Cascader
          options={[
            {
              label: 'Bamboo',
              value: 'bamboo',
            },
            {
              label: 'Light',
              value: 'light',
            },
            {
              label: 'Little',
              value: 'little',
            },
            {
              label: 'Disabled',
              value: 'disabled',
              disabled: true,
            },
          ]}
        />,
      );
      const input = container.querySelector('input')!;

      keyDown(container, KeyCode.ENTER);
      keyDown(container, KeyCode.UP);
      const activeContents = container.querySelectorAll(
        '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
      );
      expect(activeContents[activeContents.length - 1].textContent).toEqual('Little');
    });
  });

  it('should have close menu when press some keys', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="" />,
    );
    const input = container.querySelector('input')!;

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.LEFT);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.BACKSPACE);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.RIGHT);
    keyDown(container, KeyCode.ESC);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();
  });

  it('should call the Cascader onKeyDown callback in all cases', () => {
    const onKeyDown = jest.fn();

    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} onKeyDown={onKeyDown} expandIcon="" />,
    );
    const input = container.querySelector('input')!;

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.ESC);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();

    keyDown(container, KeyCode.ENTER);

    expect(onKeyDown).toHaveBeenCalledTimes(3);
  });

  it('changeOnSelect', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} changeOnSelect />,
    );
    const input = container.querySelector('input')!;

    keyDown(container, KeyCode.ENTER);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    // 0-0
    keyDown(container, KeyCode.DOWN);

    // 0-0-0
    keyDown(container, KeyCode.RIGHT);

    // Select
    keyDown(container, KeyCode.ENTER);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();
    expect(selectedValue).toEqual(['fj', 'fuzhou']);
  });

  it('all disabled should not crash', () => {
    const { container } = render(
      <Cascader
        options={addressOptions.map(opt => ({ ...opt, disabled: true }))}
        onChange={onChange}
        changeOnSelect
      />,
    );
    const input = container.querySelector('input')!;

    for (let i = 0; i < 10; i += 1) {
      keyDown(container, KeyCode.DOWN);
    }
    const activeContents = container.querySelectorAll(
      '.rc-cascader-menu-item-active .rc-cascader-menu-item-content',
    );
    expect(activeContents).toHaveLength(0);
  });

  it('should not switch column when press left/right key in search input', () => {
    const { container } = render(<Cascader options={addressOptions} showSearch />);
    const input = container.querySelector('input')!;

    fireEvent.change(input, {
      target: {
        value: '123',
      },
    });
    keyDown(container, KeyCode.LEFT);
    // Check if dropdown is open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();

    keyDown(container, KeyCode.RIGHT);
    // Check if dropdown is still open
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeTruthy();
  });

  // TODO: This is strange that we need check on this
  it.skip('should not handle keyDown events when children specify the onKeyDown', () => {
    const { container } = render(
      <Cascader options={addressOptions} onChange={onChange} expandIcon="">
        <input readOnly onKeyDown={() => {}} />
      </Cascader>,
    );

    keyDown(container, KeyCode.DOWN);
    // Check if dropdown is closed
    jest.advanceTimersByTime(100000);
    expect(isOpen(container)).toBeFalsy();
  });
});
