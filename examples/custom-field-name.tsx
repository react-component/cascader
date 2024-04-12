import React, { useState } from 'react';
import '../assets/index.less';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import type { Option } from './utils';

const addressOptions: Option[] = [
  {
    name: '福建',
    code: 'fj',
    nodes: [
      {
        name: '福州',
        code: 'fuzhou',
        nodes: [
          {
            name: '马尾',
            code: 'mawei',
          },
        ],
      },
      {
        name: '泉州',
        code: 'quanzhou',
      },
    ],
  },
  {
    name: '浙江',
    code: 'zj',
    nodes: [
      {
        name: '杭州',
        code: 'hangzhou',
        nodes: [
          {
            name: '余杭',
            code: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    name: '北京',
    code: 'bj',
    nodes: [
      {
        name: '朝阳区',
        code: 'chaoyang',
      },
      {
        name: '海淀区',
        code: 'haidian',
        disabled: true,
      },
    ],
  },
];

const Demo = () => {
  const [inputValue, setInputValue] = useState('');

  const onChange: CascaderProps<Option, 'code'>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setInputValue(selectedOptions.map(o => o.name).join(', '));
  };

  return (
    <Cascader
      options={addressOptions}
      onChange={onChange}
      fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
    >
      <input placeholder="please select address" value={inputValue} />
    </Cascader>
  );
};

export default Demo;
