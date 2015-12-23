/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  'label': '福建',
  'value': 'fj',
  'children': [{
    'label': '福州',
    'value': 'fuzhou',
    'children': [{
      'label': '马尾',
      'value': 'mawei',
    }],
  }, {
    'label': '泉州',
    'value': 'quanzhou',
  }],
}, {
  'label': '浙江',
  'value': 'zj',
  'children': [{
    'label': '杭州',
    'value': 'hangzhou',
    'children': [{
      'label': '余杭',
      'value': 'yuhang',
    }],
  }],
}, {
  'label': '北京',
  'value': 'bj',
  'children': [{
    'label': '朝阳区',
    'value': 'chaoyang',
  }, {
    'label': '海淀区',
    'value': 'haidian',
  }],
}];

const Demo = React.createClass({
  getInitialState() {
    return {
      value: [],
    };
  },
  onChange(value) {
    console.log(value);
    this.setState({ value });
  },
  setValue() {
    this.setState({
      value: ['bj', 'chaoyang'],
    });
  },
  getLabel() {
    let options = addressOptions;
    const result = [];
    this.state.value.forEach(v => {
      const target = options.find(o => o.value === v);
      if (!target) {
        return false;
      }
      result.push(target.label);
      options = target.children || [];
    });
    return result.join(', ');
  },
  render() {
    return (
      <div>
        <button onClick={this.setValue}>set value to 北京朝阳区</button>
        <Cascader value={this.state.value} options={addressOptions} onChange={this.onChange}>
          <input value={this.getLabel()} readOnly />
        </Cascader>
      </div>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
