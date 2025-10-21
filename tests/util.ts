import { act, fireEvent } from '@testing-library/react';

export function expectOpen(dom: HTMLElement, open = true) {
  act(() => {
    jest.advanceTimersByTime(100000);
  });

  const popup = dom.querySelector('.rc-cascader-dropdown')!;
  const isOpen = !!(popup && !popup.className.includes('rc-cascader-dropdown-hidden'));

  expect(isOpen).toBe(open);
}

export function selectOption(container: HTMLElement, menuIndex: number, optionIndex: number, eventType = 'click') {
  const menus = container.querySelectorAll('.rc-cascader-menu');
  const menu = menus[menuIndex];
  if (!menu) {
    throw new Error(`Menu ${menuIndex} not found`);
  }

  const options = menu.querySelectorAll('.rc-cascader-menu-item');
  const option = options[optionIndex];
  if (!option) {
    throw new Error(`Option ${optionIndex} in menu ${menuIndex} not found`);
  }

  if (eventType === 'doubleClick') {
    fireEvent.doubleClick(option);
  } else if (eventType === 'mouseEnter') {
    fireEvent.mouseEnter(option);
  } else {
    fireEvent.click(option);
  }
}
