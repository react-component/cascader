/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
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

export default () => {
  const [value, setValue] = React.useState<string[]>([]);

  const [value2, setValue2] = React.useState<string[][]>([]);

  const [disabled, setDisabled] = React.useState(false);

  return (
    <>
      <h1>Panel</h1>
      <button
        onClick={() => {
          setValue(['bj', 'haidian']);
        }}
      >
        Set Value
      </button>
      <button
        onClick={() => {
          setDisabled(prev => !prev);
        }}
      >
        {disabled ? 'enable panel' : 'disable panel'}
      </button>
      <Cascader.Panel
        value={value}
        options={addressOptions}
        onChange={nextValue => {
          console.log('Change:', nextValue);
          setValue(nextValue);
        }}
        disabled={disabled}
      />

      <Cascader.Panel
        checkable
        value={value2}
        options={addressOptions}
        onChange={nextValue => {
          console.log('Change:', nextValue);
          setValue2(nextValue);
        }}
        disabled={disabled}
      />

      <Cascader.Panel options={addressOptions} disabled={disabled} direction="rtl" />

      <Cascader.Panel notFoundContent="Empty!!!" />
    </>
  );
};
