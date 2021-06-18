/* eslint-disable no-console */
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
        disabled: true,
      },
    ],
  },
];

export default () => {
  const [multiple, setMultiple] = React.useState(false);

  return (
    <>
      <div style={{ lineHeight: '200%', marginBottom: 16 }}>
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
      </div>

      <Cascader
        multiple={multiple}
        options={addressOptions}
        onChange={(...args) => {
          console.log('值变化：', ...args);
        }}
      />
    </>
  );
};
