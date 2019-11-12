/* eslint-disable no-console,react/button-has-type */
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
  };

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };

  setValue = () => {
    this.setState({
      value: ['bj', 'chaoyang'],
    });
  };

  getLabel() {
    return arrayTreeFilter(addressOptions, (o, level) => o.value === this.state.value[level])
      .map(o => o.label)
      .join(', ');
  }

  render() {
    return (
      <div>
        <button onClick={this.setValue}>set value to 北京朝阳区</button>
        <Cascader value={this.state.value} options={addressOptions} onChange={this.onChange}>
          <input value={this.getLabel()} readOnly />
        </Cascader>
      </div>
    );
  }
}

export default Demo;
