/* eslint-disable @typescript-eslint/no-shadow */
import arrayTreeFilter from 'array-tree-filter';
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
  const [value, setValue] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const getLabel = () => {
    return arrayTreeFilter(addressOptions, (o, level) => o.value === value[level])
      .map(o => o.label)
      .join(', ');
  };

  return (
    <Cascader
      open={open}
      value={value}
      options={addressOptions}
      onPopupVisibleChange={open => setOpen(open)}
      onChange={value => setValue(value)}
    >
      <input value={getLabel()} readOnly />
    </Cascader>
  );
};

export default Demo;
