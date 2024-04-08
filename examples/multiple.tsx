/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import '../assets/index.less';
import type { MultipleCascaderProps, ValueType } from '../src';
import Cascader from '../src';
import type { Option2 } from './utils';

const { SHOW_CHILD } = Cascader;

const optionLists = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
    disableCheckbox: true,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
    disableCheckbox: false,
  },
];

const Demo = () => {
  const [options, setOptions] =
    React.useState<NonNullable<MultipleCascaderProps<Option2>['options']>>(optionLists);
  const [value, setValue] = useState<ValueType[]>([]);

  const onChange: MultipleCascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    setValue(value);
  };

  const loadData: MultipleCascaderProps<Option2>['loadData'] = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
          disableCheckbox: false,
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
          disableCheckbox: true,
        },
      ];
      setOptions([...(options || [])]);
    }, 1000);
  };

  // 直接选中一级选项，但是此时二级选项没有全部选中
  return (
    <Cascader<Option2>
      checkable
      options={options}
      showCheckedStrategy={SHOW_CHILD}
      loadData={loadData}
      value={value}
      onChange={onChange}
      changeOnSelect
    />
  );
};

export default Demo;
