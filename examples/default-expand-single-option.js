import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'zhonghuamen',
            label: '中华门',
          },
        ],
      },
    ],
  },
];

class App extends React.Component {
  state = {
    inputValue: '',
    value: [],
  };

  onChange = (value, selectedOptions) => {
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
  };

  render() {
    return (
      <Cascader options={options} value={this.state.value} changeOnSelect onChange={this.onChange}>
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  }
}

export default App;
