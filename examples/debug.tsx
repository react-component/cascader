import React from 'react';
import '../assets/index.less';
import Cascader from '../src';
import type { Option2 } from './utils';

const addressOptions: Option2[] = [
  // ...new Array(20).fill(null).map((_, i) => ({ label: String(i), value: `99${i}` })),
  {
    label: <span>空孩子</span>,
    value: 'empty',
    children: [],
  },
  {
    label: '福建',
    value: 'fj',
    title: '测试标题',
    children: [
      {
        label: '福州',
        value: 'fuzhou',
        disabled: true,
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
            label: '禁用',
            value: 'disabled',
            disabled: true,
          },
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
      {
        label: 'TEST',
        value: 'test',
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
  // ...new Array(20).fill(null).map((_, i) => ({ label: String(i), value: i })),
];

const Demo = () => {
  const [multiple, setMultiple] = React.useState(true);

  const onChange = (value: string[], selectedOptions: Option2[]) => {
    console.log('[DEBUG] onChange - value:', value);
    console.log('[DEBUG] onChange - selectedOptions:', selectedOptions);
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
      {multiple ? (
        <Cascader style={{ width: 200 }} checkable defaultValue={[['fj'], ['fuzhou']]} showSearch />
      ) : (
        <Cascader
          style={{ width: 200 }}
          options={addressOptions}
          onChange={onChange}
          checkable={false}
          allowClear
          defaultValue={['fj', 'fuzhou']}
          showSearch
        />
      )}
    </>
  );
};

export default Demo;
