/* eslint-disable no-console */
import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const addressOptions = [
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
];

class Demo extends React.Component {
  state = {
    inputValue: '',
    options: addressOptions,
  };

  onChange = (value, selectedOptions) => {
    console.log('OnChange:', value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  };

  loadData = selectedOptions => {
    console.log('onLoad:', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label}动态加载1`,
          value: 'dynamic1',
          isLeaf: false,
        },
        {
          label: `${targetOption.label}动态加载2`,
          value: 'dynamic2',
        },
      ];
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        options: [...this.state.options],
      });
    }, 500);
  };

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        loadingIcon="💽"
        changeOnSelect
      >
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  }
}

export default Demo;
