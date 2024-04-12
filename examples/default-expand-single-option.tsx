/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import '../assets/index.less';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import type { Option2 } from './utils';

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'zhonghuamen',
            label: '中华门',
          },
        ],
      },
    ],
  },
];

const App = () => {
  const [inputValue, setInputValue] = useState('');

  const [value, setValue] = useState<string[]>([]);

  const onChange: CascaderProps<Option2, 'value'>['onChange'] = (value, selectedOptions) => {
    const lastSelected = selectedOptions[selectedOptions.length - 1];
    if (lastSelected.children && lastSelected.children.length === 1) {
      value.push(lastSelected.children[0].value as string);
      setInputValue(selectedOptions.map(o => o.label).join(', '));
      setValue(value);
      return;
    }
    setInputValue(selectedOptions.map(o => o.label).join(', '));
    setValue(value);
  };

  return (
    <Cascader options={options} value={value} changeOnSelect onChange={onChange}>
      <input value={inputValue} readOnly />
    </Cascader>
  );
};

export default App;
