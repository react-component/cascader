/* eslint-disable no-console */
import React from 'react';
import arrayTreeFilter from 'array-tree-filter';
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

class Demo extends React.Component {
  state = {
    value: [],
    popupVisible: false,
  };

  onChange = value => {
    this.setState({ value });
  };

  onPopupVisibleChange = popupVisible => {
    this.setState({ popupVisible });
  };

  getLabel() {
    return arrayTreeFilter(addressOptions, (o, level) => o.value === this.state.value[level])
      .map(o => o.label)
      .join(', ');
  }

  render() {
    return (
      <Cascader
        popupVisible={this.state.popupVisible}
        value={this.state.value}
        options={addressOptions}
        onPopupVisibleChange={this.onPopupVisibleChange}
        onChange={this.onChange}
      >
        <input value={this.getLabel()} readOnly />
      </Cascader>
    );
  }
}

export default Demo;
