import React from 'react';
import { render } from '@testing-library/react';
import Cascader from '../src';
import { clickOption, expectOpen } from './util';

describe('Cascader.Scroll', () => {
  const options = ['aa', 'bb'].map(prefix => ({
    value: prefix,
    label: prefix,
    children: Array.from({ length: 30 }, (_, i) => ({
      value: `${prefix}-${i}`,
      label: `${prefix}-${i}`,
    })),
  }));

  const renderCascader = () =>
    render(
      <Cascader options={options} open>
        <input readOnly />
      </Cascader>,
    );

  const mockScrollTo = (menu: HTMLElement) => {
    const calls: Array<[number, number]> = [];
    menu.scrollTo = ((left: number, top: number) => {
      calls.push([left, top]);
    }) as HTMLElement['scrollTo'];
    return calls;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reset child column scroll when switching parent', () => {
    const { container } = renderCascader();

    expectOpen(container);

    // Expand the first parent to show the child column
    clickOption(container, 0, 0);
    let menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus).toHaveLength(2);

    const calls = mockScrollTo(menus[1] as HTMLElement);

    // Switch to the second parent: the child column shows a fresh list
    clickOption(container, 0, 1);

    menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus).toHaveLength(2);
    expect(calls).toContainEqual([0, 0]);
  });

  it('keep child column scroll when options are unchanged', () => {
    const { container, rerender } = renderCascader();

    expectOpen(container);

    clickOption(container, 0, 0);
    const menus = container.querySelectorAll('.rc-cascader-menu');
    expect(menus).toHaveLength(2);

    const calls = mockScrollTo(menus[1] as HTMLElement);

    // Re-render with the same parent column content: scroll must not be touched
    rerender(
      <Cascader options={options} open>
        <input readOnly />
      </Cascader>,
    );

    expect(calls).toHaveLength(0);
  });
});
