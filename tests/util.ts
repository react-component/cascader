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

// Helper functions to replace enzyme-specific functionality
export function isOpen(container: HTMLElement): boolean {
  // Check the dropdown visibility
  const dropdown = container.querySelector('.rc-cascader-dropdown');
  return !!dropdown && !dropdown.className.includes('rc-cascader-dropdown-hidden');
}

export function findOption(container: HTMLElement, menuIndex: number, itemIndex: number): HTMLElement | null {
  const menus = container.querySelectorAll('ul.rc-cascader-menu');
  const menu = menus[menuIndex];
  if (!menu) return null;
  
  const itemList = menu.querySelectorAll('li.rc-cascader-menu-item');
  return itemList[itemIndex] || null;
}

export function clickOption(container: HTMLElement, menuIndex: number, itemIndex: number, type: 'click' | 'doubleClick' | 'mouseEnter' = 'click'): void {
  const option = findOption(container, menuIndex, itemIndex);
  if (!option) return;
  
  if (type === 'doubleClick') {
    fireEvent.doubleClick(option);
  } else if (type === 'mouseEnter') {
    fireEvent.mouseEnter(option);
  } else {
    fireEvent.click(option);
  }
}
