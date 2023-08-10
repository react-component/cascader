/* eslint-disable no-console, react/prop-types */
import type { BuildInPlacements } from 'rc-trigger/lib/interface';
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

class MyCascader extends React.Component<{ builtinPlacements?: BuildInPlacements }> {
  state = {
    inputValue: '',
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  };

  render() {
    const { builtinPlacements } = this.props;
    return (
      <Cascader
        options={addressOptions}
        builtinPlacements={builtinPlacements}
        onChange={this.onChange}
      >
        <input
          placeholder={builtinPlacements ? 'Will not adjust position' : 'Will adjust position'}
          value={this.state.inputValue}
          style={{ width: 170 }}
        />
      </Cascader>
    );
  }
}

const placements = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustY: 1,
    },
  },
};

function Demo() {
  return (
    <div>
      <MyCascader />
      <br />
      <br />
      <MyCascader builtinPlacements={placements} />
    </div>
  );
}

export default Demo;
