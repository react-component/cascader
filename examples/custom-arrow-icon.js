/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import './custom-arrow-icon.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  label: '福建',
  value: 'fj',
  children: [{
    label: '福州',
    value: 'fuzhou',
    children: [{
      label: '马尾',
      value: 'mawei',
    }],
  }, {
    label: '泉州',
    value: 'quanzhou',
  }],
}, {
  label: '浙江',
  value: 'zj',
  children: [{
    label: '杭州',
    value: 'hangzhou',
    children: [{
      label: '余杭',
      value: 'yuhang',
    }],
  }],
}, {
  label: '北京',
  value: 'bj',
  children: [{
    label: '朝阳区',
    value: 'chaoyang',
  }, {
    label: '海淀区',
    value: 'haidian',
    disabled: true,
  }],
}];

const svgPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-' +
  '3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2' +
  ' 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 ' +
  '3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2' +
  ' 14h91.5c1.9 0 3.8-0.7 5.2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

class Demo extends React.Component {
  state = {
    inputValue: '',
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  expandIcon = (
    <svg
      viewBox="0 0 1024 1024"
      style={{ verticalAlign: '-.125em' }}
      width="1em"
      height="1em"
      fill="currentColor"
      style={{
        fontSize: '12px',
        color: '#999',
        position: 'absolute',
        right: '10px',
        top: '10px',
      }}
    >
      <path d={svgPath} />
    </svg>
  );

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Cascader
          options={addressOptions}
          onChange={this.onChange}
          expandIcon={this.expandIcon}
        >
          <input
            placeholder="please select address"
            value={this.state.inputValue}
          />
        </Cascader>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
