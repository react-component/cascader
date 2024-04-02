/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
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
  const [value, setValue] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

  const onChange = value => {
    setValue(value);
  };

  const onPopupVisibleChange = popupVisible => {
    setPopupVisible(popupVisible);
  };

  const getLabel = () => {
    return arrayTreeFilter(addressOptions, (o, level) => o.value === value[level])
      .map(o => o.label)
      .join(', ');
  };

  return (
    <Cascader
      popupVisible={popupVisible}
      value={value}
      options={addressOptions}
      onPopupVisibleChange={onPopupVisibleChange}
      onChange={onChange}
    >
      <input value={getLabel()} readOnly />
    </Cascader>
  );
};

export default Demo;
