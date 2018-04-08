/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  name: '福建',
  code: 'fj',
  children: [{
    name: '福州',
    code: 'fuzhou',
    children: [{
      name: '马尾',
      code: 'mawei',
    }],
  }, {
    name: '泉州',
    code: 'quanzhou',
  }],
}, {
  name: '浙江',
  code: 'zj',
  children: [{
    name: '杭州',
    code: 'hangzhou',
    children: [{
      name: '余杭',
      code: 'yuhang',
    }],
  }],
}, {
  name: '北京',
  code: 'bj',
  children: [{
    name: '朝阳区',
    code: 'chaoyang',
  }, {
    name: '海淀区',
    code: 'haidian',
    disabled: true,
  }],
}];

class Demo extends React.Component {
  state = {
    inputValue: '',
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.name).join(', '),
    });
  }

  render() {
    return (
      <Cascader
        options={addressOptions}
        onChange={this.onChange}
        labelField="name"
        valueField="code"
      >
        <input
          placeholder="please select address"
          value={this.state.inputValue}
        />
      </Cascader>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
