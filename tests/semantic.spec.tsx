import { render } from '@testing-library/react';

import React from 'react';
import Cascader from '../src';

describe('Cascader.Search', () => {
  it('Should support semantic', () => {
    const testClassNames = {
      prefix: 'test-prefix',
      suffix: 'test-suffix',
      input: 'test-input',
      placeholder: 'test-placeholder',
      content: 'test-content',
      popup: {
        list: 'test-popup-list',
        listItem: 'test-popup-list-item',
      },
    };
    const testStyles = {
      prefix: { color: 'green' },
      suffix: { color: 'blue' },
      input: { color: 'purple' },
      placeholder: { fontSize: '12px' },
      content: { backgroundColor: 'lightgray' },
      popup: {
        list: { background: 'red' },
        listItem: { color: 'yellow' },
      },
    };
    const { container } = render(
      <Cascader
        classNames={testClassNames}
        styles={testStyles}
        prefix="prefix"
        suffixIcon={() => 'icon'}
        open
        options={[{ label: 'bamboo', value: 'bamboo' }]}
        optionRender={option => `${option.label} - test`}
      />,
    );

    const input = container.querySelector('.rc-cascader-input');
    const prefix = container.querySelector('.rc-cascader-prefix');
    const suffix = container.querySelector('.rc-cascader-suffix');
    const placeholder = container.querySelector('.rc-cascader-placeholder');
    const content = container.querySelector('.rc-cascader-content');
    const list = container.querySelector('.rc-cascader-menu');
    const listItem = container.querySelector('.rc-cascader-menu-item');

    // Test styles for supported semantic elements
    expect(input).toHaveStyle(testStyles.input);
    expect(prefix).toHaveStyle(testStyles.prefix);
    expect(suffix).toHaveStyle(testStyles.suffix);
    if (placeholder) {
      expect(placeholder).toHaveStyle(testStyles.placeholder);
    }
    expect(content).toHaveStyle(testStyles.content);
    expect(list).toHaveStyle(testStyles.popup.list);
    expect(listItem).toHaveStyle(testStyles.popup.listItem);

    // Test class names for supported semantic elements
    expect(input?.className).toContain(testClassNames.input);
    expect(prefix?.className).toContain(testClassNames.prefix);
    expect(suffix?.className).toContain(testClassNames.suffix);
    if (placeholder) {
      expect(placeholder?.className).toContain(testClassNames.placeholder);
    }
    expect(content?.className).toContain(testClassNames.content);
    expect(list?.className).toContain(testClassNames.popup.list);
    expect(listItem?.className).toContain(testClassNames.popup.listItem);
  });

  it('Should support semantic for multiple mode', () => {
    const testClassNames = {
      prefix: 'test-prefix',
      suffix: 'test-suffix',
      input: 'test-input',
      placeholder: 'test-placeholder',
      content: 'test-content',
      item: 'test-item',
      itemContent: 'test-item-content',
      itemRemove: 'test-item-remove',
      popup: {
        list: 'test-popup-list',
        listItem: 'test-popup-list-item',
      },
    };
    const testStyles = {
      prefix: { color: 'green' },
      suffix: { color: 'blue' },
      input: { color: 'purple' },
      placeholder: { fontSize: '12px' },
      content: { backgroundColor: 'lightgray' },
      item: { border: '1px solid red' },
      itemContent: { fontWeight: 'bold' },
      itemRemove: { color: 'red' },
      popup: {
        list: { background: 'red' },
        listItem: { color: 'yellow' },
      },
    };
    const { container } = render(
      <Cascader
        classNames={testClassNames}
        styles={testStyles}
        prefix="prefix"
        suffixIcon={() => 'icon'}
        open
        checkable
        value={[['bamboo']]}
        options={[
          { label: 'bamboo', value: 'bamboo', children: [{ label: 'leaf', value: 'leaf' }] },
        ]}
        optionRender={option => `${option.label} - test`}
      />,
    );

    const input = container.querySelector('.rc-cascader-input');
    const prefix = container.querySelector('.rc-cascader-prefix');
    const suffix = container.querySelector('.rc-cascader-suffix');
    const placeholder = container.querySelector('.rc-cascader-placeholder');
    const content = container.querySelector('.rc-cascader-content');
    const list = container.querySelector('.rc-cascader-menu');
    const listItem = container.querySelector('.rc-cascader-menu-item');
    const item = container.querySelector('.rc-cascader-selection-item');
    const itemContent = container.querySelector('.rc-cascader-selection-item-content');
    const itemRemove = container.querySelector('.rc-cascader-selection-item-remove');

    // Test styles for supported semantic elements
    expect(input).toHaveStyle(testStyles.input);
    expect(prefix).toHaveStyle(testStyles.prefix);
    expect(suffix).toHaveStyle(testStyles.suffix);
    if (placeholder) {
      expect(placeholder).toHaveStyle(testStyles.placeholder);
    }
    expect(content).toHaveStyle(testStyles.content);
    expect(list).toHaveStyle(testStyles.popup.list);
    expect(listItem).toHaveStyle(testStyles.popup.listItem);
    expect(item).toHaveStyle(testStyles.item);
    expect(itemContent).toHaveStyle(testStyles.itemContent);
    expect(itemRemove).toHaveStyle(testStyles.itemRemove);

    // Test class names for supported semantic elements
    expect(input?.className).toContain(testClassNames.input);
    expect(prefix?.className).toContain(testClassNames.prefix);
    expect(suffix?.className).toContain(testClassNames.suffix);
    if (placeholder) {
      expect(placeholder?.className).toContain(testClassNames.placeholder);
    }
    expect(content?.className).toContain(testClassNames.content);
    expect(list?.className).toContain(testClassNames.popup.list);
    expect(listItem?.className).toContain(testClassNames.popup.listItem);
    expect(item?.className).toContain(testClassNames.item);
    expect(itemContent?.className).toContain(testClassNames.itemContent);
    expect(itemRemove?.className).toContain(testClassNames.itemRemove);
  });
});
