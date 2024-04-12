import React, { useState } from 'react';
import '../assets/index.less';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import type { Option2 } from './utils';

const addressOptions: CascaderProps<Option2>['options'] = [
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

const svgPath =
  'M869 487.8L491.2 159.9c-2.9-2.5-6.6-' +
  '3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2' +
  ' 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 ' +
  '3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2' +
  ' 14h91.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8' +
  ' 14.7-35.6 0-48.4z';

const loadingPath =
  'M511.4 124C290.5 124.3 112 303 112' +
  ' 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-' +
  '0.3 13 6.3 12.9l167-0.8c5.2 0 9-4.9 7.7-9.9L369.8 72' +
  '7c-1.6-6.5-10-8.3-14.1-3L315 776.1c-10.2-8-20-16.7-2' +
  '9.3-26-29.4-29.4-52.5-63.6-68.6-101.7C200.4 609 192 ' +
  '567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-7' +
  '2.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 ' +
  '212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.' +
  '1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.' +
  '7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.' +
  '5c-16.1 38.1-39.2 72.3-68.6 101.7-7.5 7.5-15.3 14.5-' +
  '23.4 21.2-3.4 2.8-3.9 7.7-1.2 11.1l39.4 50.5c2.8 3.5' +
  ' 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-' +
  '221.1-179.4-400.2-400.6-399.9z';

const Demo = () => {
  const [inputValue, setInputValue] = useState('');
  const [dynamicInputValue, setDynamicInputValue] = useState('');
  const [options, setOptions] = useState([
    {
      label: '福建',
      isLeaf: false,
      value: 'fj',
    },
    {
      label: '浙江',
      isLeaf: false,
      value: 'zj',
    },
  ]);

  const onChange: CascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  const onChangeDynamic: CascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setDynamicInputValue(selectedOptions.map(o => o.label).join(', '));
  };

  const expandIcon = (
    <i>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{
          verticalAlign: '-.125em',
          margin: 'auto',
        }}
      >
        <path d={svgPath} />
      </svg>
    </i>
  );

  const loadingIcon = (
    <i
      style={{
        position: 'absolute',
        right: '12px',
        color: '#aaa',
      }}
    >
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{
          verticalAlign: '-.125em',
          margin: 'auto',
        }}
      >
        <path d={loadingPath} />
      </svg>
    </i>
  );

  const loadData: CascaderProps<Option2>['loadData'] = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label}动态加载1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label}动态加载2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Cascader
        style={{ marginBottom: '2rem' }}
        options={addressOptions}
        onChange={onChange}
        expandIcon={expandIcon}
      >
        <input placeholder="please select address" value={inputValue} />
      </Cascader>
      <Cascader
        options={options}
        loadData={loadData}
        onChange={onChangeDynamic}
        expandIcon={expandIcon}
        loadingIcon={loadingIcon}
        changeOnSelect
      >
        <input value={dynamicInputValue} readOnly />
      </Cascader>
    </div>
  );
};

export default Demo;
