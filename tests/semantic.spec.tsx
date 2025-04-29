import { render } from '@testing-library/react';

import React from 'react';
import Cascader from '../src';

describe('Cascader.Search', () => {
  it('Should support semantic', () => {
    const testClassNames = {
      prefix: 'test-prefix',
      suffix: 'test-suffix',
      input: 'test-input',
      popup: {
        list: 'test-popup-list',
        listItem: 'test-popup-list-item',
      },
    };
    const testStyles = {
      prefix: { color: 'green' },
      suffix: { color: 'blue' },
      input: { color: 'purple' },
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
    const input = container.querySelector('.rc-cascader-selection-search-input');
    const prefix = container.querySelector('.rc-cascader-prefix');
    const suffix = container.querySelector('.rc-cascader-arrow');
    const list = container.querySelector('.rc-cascader-menu');
    const listItem = container.querySelector('.rc-cascader-menu-item');
    expect(input).toHaveStyle(testStyles.input);
    expect(prefix).toHaveStyle(testStyles.prefix);
    expect(suffix).toHaveStyle(testStyles.suffix);
    expect(list).toHaveStyle(testStyles.popup.list);
    expect(listItem).toHaveStyle(testStyles.popup.listItem);
    expect(input?.className).toContain(testClassNames.input);
    expect(prefix?.className).toContain(testClassNames.prefix);
    expect(suffix?.className).toContain(testClassNames.suffix);
    expect(list?.className).toContain(testClassNames.popup.list);
    expect(listItem?.className).toContain(testClassNames.popup.listItem);
  });
});
