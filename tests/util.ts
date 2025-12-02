import { act, createEvent, fireEvent } from '@testing-library/react';

export function expectOpen(dom: HTMLElement, open = true) {
  act(() => {
    jest.advanceTimersByTime(100000);
  });

  const popup = dom.querySelector('.rc-cascader-dropdown')!;
  const isPopupOpen = !!(popup && !popup.className.includes('rc-cascader-dropdown-hidden'));

  expect(isPopupOpen).toBe(open);
}

export function selectOption(
  container: HTMLElement,
  menuIndex: number,
  optionIndex: number,
  eventType = 'click',
) {
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

// Helper functions for testing
export function isOpen(container: HTMLElement): boolean {
  // Check the dropdown visibility
  const dropdown = container.querySelector('.rc-cascader-dropdown');
  return !!dropdown && !dropdown.className.includes('rc-cascader-dropdown-hidden');
}

export function findOption(
  container: HTMLElement,
  menuIndex: number,
  itemIndex: number,
): HTMLElement | null {
  const menus = container.querySelectorAll('ul.rc-cascader-menu');
  const menu = menus[menuIndex];
  if (!menu) return null;

  const itemList = menu.querySelectorAll('li.rc-cascader-menu-item');
  return (itemList[itemIndex] as HTMLElement) || null;
}

export function clickOption(
  container: HTMLElement,
  menuIndex: number,
  itemIndex: number,
  type: 'click' | 'doubleClick' | 'mouseEnter' = 'click',
): void {
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

// Helper function for search tests
export function doSearch(container: HTMLElement, search: string): void {
  const input = container.querySelector('input');
  if (input) {
    fireEvent.change(input, {
      target: {
        value: search,
      },
    });
  }
}

export function keyDown(container: HTMLElement, keyCode: number) {
  const input = container.querySelector('input');

  const keyEvent = createEvent.keyDown(input!, {
    which: keyCode,
    keyCode,
  });

  fireEvent(input!, keyEvent);
}
