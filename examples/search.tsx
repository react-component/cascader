import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const testClassNames = {
  prefix: 'test-prefix',
  suffix: 'test-suffix',
  input: 'test-input',
  popup: {
    list: 'test-popup-list',
    listItem: 'test-popup-list-item',
  },
};
const testStyles = {
  popup: {
    list: { background: 'red' },
    listItem: { color: 'yellow' },
  },
};
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
            label: '马尾-mw',
            value: 'mawei',
          },
        ],
      },
      {
        label: '泉州-qz',
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
  return (
    <Cascader
      prefix="prefix"
      suffixIcon={() => 'icon'}
      classNames={testClassNames}
      styles={testStyles}
      options={addressOptions}
      showSearch
      style={{ width: 300 }}
      animation="slide-up"
      notFoundContent="Empty Content!"
    />
  );
};

export default Demo;
