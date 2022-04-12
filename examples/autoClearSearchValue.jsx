/* eslint-disable */
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

const Demo = () => {
  const [multiple, setMultiple] = React.useState(false);
  const [autoClearSearchValue,setAutoClearSearchValue] = React.useState(true);
  const onChange = (value, selectedOptions) => {
    console.log(value,selectedOptions)
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
      <label>
        <input
          type="checkbox"
          checked={autoClearSearchValue}
          onChange={() => {
            setAutoClearSearchValue(!autoClearSearchValue);
          }}
        />
        autoClearSearchValue
      </label>
      <Cascader
        style={{ width: 200 }}
        options={addressOptions}
        onChange={onChange}
        checkable={multiple}
        autoClearSearchValue={autoClearSearchValue}
        allowClear
        defaultValue={['fj', 'fuzhou']}
        showSearch
      />
    </>
  );
};
export default Demo;
