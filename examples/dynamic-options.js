/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  'label': '福建',
  'value': 'fj',
}, {
  'label': '浙江',
  'value': 'zj',
}];

const Demo = React.createClass({
  getInitialState() {
    return {
      inputValues: [],
      options: addressOptions,
    };
  },
  onSelect(targetOption, selectedOptions, done) {
    const options = this.state.options;
    if (selectedOptions.length === 1 && !targetOption.children) {
      targetOption.label += ' loading';
      // 动态加载下级数据
      setTimeout(() => {
        targetOption.label = targetOption.label.replace(' loading', '');
        targetOption.children = [{
          'label': targetOption.label + '动态加载1',
          'value': 'dynamic1',
        }, {
          'label': targetOption.label + '动态加载2',
          'value': 'dynamic2',
        }];
        this.setState({ options });
        done();
      }, 1000);
      return;
    }
    done();
  },
  onChange(value, selectedOptions) {
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  },
  render() {
    return (
      <Cascader options={this.state.options}
        onSelect={this.onSelect}
        onChange={this.onChange}>
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
