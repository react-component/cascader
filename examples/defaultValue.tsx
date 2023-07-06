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
    label: '占位1',
    value: 'zw1',
  },
  {
    label: '占位2',
    value: 'zw2',
  },
  {
    label: '占位3',
    value: 'zw3',
  },
  {
    label: '占位4',
    value: 'zw4',
  },
  {
    label: '占位5',
    value: 'zw5',
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

const defaultOptions = [
  {
    label: '浙江',
    value: 'zj',
  },
  {
    label: '杭州',
    value: 'hangzhou',
  },
  {
    label: '余杭',
    value: 'yuhang',
  },
];

class Demo extends React.Component {
  state = {
    inputValue: defaultOptions.map(o => o.label).join(', '),
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  };

  render() {
    const defaultValue = defaultOptions.map(o => o.value);
    return (
      <Cascader defaultValue={defaultValue} options={addressOptions} onChange={this.onChange}>
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  }
}

export default Demo;
