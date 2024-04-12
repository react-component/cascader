/* eslint-disable @typescript-eslint/no-shadow */
import arrayTreeFilter from 'array-tree-filter';
import React, { useState } from 'react';
import '../assets/index.less';
import type { CascaderProps } from '../src';
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

const Demo = () => {
  const [value, setValue] = useState<string[]>([]);
  const onChange: CascaderProps<Option2, 'value'>['onChange'] = value => {
    console.log(value);
    setValue(value);
  };

  const handleSetValue = () => {
    setValue(['bj', 'chaoyang']);
  };

  const getLabel = () => {
    return arrayTreeFilter(addressOptions, (o, level) => o.value === value[level])
      .map(o => o.label)
      .join(', ');
  };

  return (
    <div>
      <button onClick={handleSetValue}>set value to 北京朝阳区</button>
      <Cascader value={value} options={addressOptions} onChange={onChange}>
        <input value={getLabel()} readOnly />
      </Cascader>
    </div>
  );
};

export default Demo;
