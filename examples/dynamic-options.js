/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  label: '福建',
  isLeaf: false,
  value: 'fj',
}, {
  label: '浙江',
  isLeaf: false,
  value: 'zj',
}, {
  label: '北京',
  isLeaf: false,
  value: 'bj',
}];

class Demo extends React.Component {
  state = {
    inputValue: '',
    options: addressOptions,
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.loading = false;

      if (targetOption.value === 'bj') {
        targetOption.children = [];
      } else {
        targetOption.children = [{
          label: `${targetOption.label}动态加载1`,
          value: 'dynamic1',
        }, {
          label: `${targetOption.label}动态加载2`,
          value: 'dynamic2',
        }];
      }
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  }

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        notFoundContent={'无数据'}
      >
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
