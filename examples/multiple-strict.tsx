import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
          { value: 'xiasha', label: 'Xia Sha' },
        ],
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        children: [{ value: 'jiangbei', label: 'Jiangbei' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [{ value: 'xuanwu', label: 'Xuanwu' }],
      },
    ],
  },
];

const Demo = () => {
  const onChange = (value: string[][], selectedOptions: any) => {
    console.log(value, selectedOptions);
  };

  // enable `checkStrictly` so each level is checked independently:
  // clicking a province checks only the province, clicking a city checks only
  // the city — neither pulls in descendants nor affects ancestors (no half-checked state).
  return (
    <Cascader
      checkable
      checkStrictly
      options={options}
      onChange={onChange}
      style={{ width: 300 }}
    />
  );
};

export default Demo;
