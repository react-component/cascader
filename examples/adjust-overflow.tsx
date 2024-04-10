import React, { useState } from 'react';
import type { BuildInPlacements } from '@rc-component/trigger/lib/interface';
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
        disabled: true,
      },
    ],
  },
];

const MyCascader = ({ builtinPlacements }: { builtinPlacements?: BuildInPlacements }) => {
  const [inputValue, setInputValue] = useState('');

  const onChange: CascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  return (
    <Cascader options={addressOptions} builtinPlacements={builtinPlacements} onChange={onChange}>
      <input
        placeholder={builtinPlacements ? 'Will not adjust position' : 'Will adjust position'}
        value={inputValue}
        style={{ width: 170 }}
      />
    </Cascader>
  );
};

const placements = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustY: 1,
    },
  },
};

function Demo() {
  return (
    <div>
      <MyCascader />
      <br />
      <br />
      <MyCascader builtinPlacements={placements} />
    </div>
  );
}

export default Demo;
