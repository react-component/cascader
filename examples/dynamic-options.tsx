/* eslint-disable no-console */
import React, { useState } from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions = [
  {
    label: '福建',
    isLeaf: false,
    value: 'fj',
  },
  {
    label: '浙江',
    isLeaf: false,
    value: 'zj',
  },
];

const Demo = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(addressOptions);

  const onChange = (value, selectedOptions) => {
    console.log('OnChange:', value, selectedOptions);
    setInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  const loadData = selectedOptions => {
    console.log('onLoad:', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label}动态加载1`,
          value: 'dynamic1',
          isLeaf: false,
        },
        {
          label: `${targetOption.label}动态加载2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]);
    }, 500);
  };

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onChange}
      loadingIcon="💽"
      changeOnSelect
    >
      <input value={inputValue} readOnly />
    </Cascader>
  );
};

export default Demo;
