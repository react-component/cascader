/* eslint-disable no-console */
import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions1 = [
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
  {
    label: '顶层禁用',
    value: 'disabled',
    disabled: true,
    children: [
      {
        label: '看不见',
        value: 'invisible',
      },
    ],
  },
];

const addressOptions = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1',
        label: '1',
      },
    ],
  },
];

const defaultValue = ['fj', 'fuzhou', 'mawei'];

const Demo = () => {
  const [multiple, setMultiple] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const onChange = (value: any, selectedOptions: any) => {
    console.log('[DEBUG] onChange - value:', value);
    console.log('[DEBUG] onChange - selectedOptions:', selectedOptions);
    setInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={multiple}
          onChange={() => {
            setMultiple(!multiple);
          }}
        />
        Multiple
      </label>
      <Cascader
        style={{ width: 200 }}
        options={addressOptions1}
        onChange={onChange}
        multiple={multiple}
        allowClear
        defaultValue={multiple ? [defaultValue] : defaultValue}
        showSearch
      />
    </>
  );
};

export default Demo;