import React from 'react';
import '../assets/index.less';
import Cascader from '../src';
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
  const [options, setOptions] = React.useState(optionLists);

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const loadData = selectedOptions => {
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
      setOptions([...options]);
    }, 1000);
  };

  // 直接选中一级选项，但是此时二级选项没有全部选中
  return (
    <Cascader
      checkable
      options={options}
      showCheckedStrategy={SHOW_CHILD}
      loadData={loadData}
      onChange={onChange}
      changeOnSelect
    />
  );
};

export default Demo;
