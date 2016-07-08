import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];

const App = React.createClass({
  getInitialState() {
    return {
      inputValue: '',
      value: [],
    };
  },
  onChange(value, selectedOptions) {
    const lastSelected = selectedOptions[selectedOptions.length - 1];
    if (lastSelected.children && lastSelected.children.length === 1) {
      value.push(lastSelected.children[0].value);
      this.setState({
        inputValue: selectedOptions.map(o => o.label).join(', '),
        value,
      });
      return;
    }
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
      value,
    });
  },
  render() {
    return (
      <Cascader options={options} value={this.state.value} changeOnSelect onChange={this.onChange}>
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
