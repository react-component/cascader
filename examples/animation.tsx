import React, { useState } from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions = [
  {
    label: '福建',
    value: 'fj',
    children: [
      {
        label: '福州',
        value: 'fuzhou',
        children: [
          {
            label: '马尾',
            value: 'mawei',
          },
        ],
      },
      {
        label: '泉州',
        value: 'quanzhou',
      },
    ],
  },
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          {
            label: '余杭',
            value: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    label: '北京',
    value: 'bj',
    children: [
      {
        label: '朝阳区',
        value: 'chaoyang',
      },
      {
        label: '海淀区',
        value: 'haidian',
      },
    ],
  },
];

const Demo = () => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  return (
    <Cascader options={addressOptions} onChange={onChange} animation="slide-up">
      <input value={inputValue} readOnly />
    </Cascader>
  );
};

export default Demo;
