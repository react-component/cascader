/* eslint-disable */
import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions = [
  {
    label: '空孩子',
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
  ...new Array(20).fill(null).map((_, i) => ({ label: String(i), value: i })),
];

// const defaultValue = ['fj', 'fuzhou'];
// const defaultValue = ['fj', 'quanzhou'];
// const defaultValue = ['fj', 'not-exist'];
// const defaultValue = ['not-exist'];
const defaultValue = ['not', 'exist'];

const Demo = () => {
  const [multiple, setMultiple] = React.useState(false);
  const [, setInputValue] = React.useState('');

  const onChange = (value: any, selectedOptions: any) => {
    console.log('[DEBUG] onChange - value:', value);
    console.log('[DEBUG] onChange - selectedOptions:', selectedOptions);
    // setInputValue(selectedOptions.map(o => o.label).join(', '));
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
        options={addressOptions}
        onChange={onChange}
        checkable={multiple}
        allowClear
        // defaultValue={multiple ? [defaultValue] : defaultValue}
        defaultValue={[['not', 'yet'], ['exist']]}
        showSearch
        // showSearch={{ limit: 1 }}
        open
        // direction="rtl"
        // searchValue="福a"
        // changeOnSelect
      />
    </>
  );
};

export default Demo;
