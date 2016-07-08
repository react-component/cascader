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
}];

const Demo = React.createClass({
  getInitialState() {
    return {
      inputValues: [],
      options: addressOptions,
    };
  },
  onChange(value, selectedOptions) {
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  },
  loadData(selectedOptions) {
    const options = this.state.options;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.label += ' loading';
    // 动态加载下级数据
    setTimeout(() => {
      targetOption.label = targetOption.label.replace(' loading', '');
      targetOption.children = [{
        label: `${targetOption.label}动态加载1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label}动态加载2`,
        value: 'dynamic2',
      }];
      this.setState({ options });
    }, 1000);
    this.setState({ options });
  },
  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
      >
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
