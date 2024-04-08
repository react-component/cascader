/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import '../assets/index.less';
import type { MultipleCascaderProps, SingleCascaderProps, ValueType } from '../src';
import Cascader from '../src';
import type { Option2 } from './utils';

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
  const [value, setValue] = React.useState<ValueType>([]);

  const onChange: SingleCascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setValue(value);
  };

  const [value2, setValue2] = React.useState<ValueType[]>([]);

  const onMultipleChange: MultipleCascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setValue2(value2);
  };

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
      <Cascader.Panel value={value} options={addressOptions} onChange={onChange} />

      <Cascader.Panel
        checkable
        value={value}
        options={addressOptions}
        onChange={onMultipleChange}
      />

      <Cascader.Panel options={addressOptions} direction="rtl" />

      <Cascader.Panel notFoundContent="Empty!!!" />
    </>
  );
};
