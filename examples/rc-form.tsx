/* eslint-disable no-console, react/no-multi-comp, react/prop-types, react/button-has-type,prefer-destructuring,max-len, max-classes-per-file */
import arrayTreeFilter from 'array-tree-filter';
import { createForm } from 'rc-form';
import { Component } from 'react';
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
      },
    ],
  },
];

class CascaderInput extends Component {
  onChange = value => {
    const props = this.props;
    if (props.onChange) {
      props.onChange(value);
    }
  };

  getLabel() {
    const props = this.props;
    const value = props.value || [];
    return arrayTreeFilter(props.options, (o, level) => o.value === value[level])
      .map(o => o.label)
      .join(', ');
  }

  render() {
    const props = this.props;
    return (
      <Cascader {...this.props} onChange={this.onChange}>
        <input placeholder={props.placeholder} value={this.getLabel()} readOnly />
      </Cascader>
    );
  }
}

class Form extends Component {
  onSubmit = e => {
    const props = this.props;
    const { form } = props;
    e.preventDefault();
    form.validateFields((error, values) => {
      if (!error) {
        console.log('ok', values);
      } else {
        console.error('error', error, values);
      }
    });
  };

  render() {
    const props = this.props;
    const { form } = props;
    const addressFieldError = form.getFieldError('address');
    return (
      <div style={{ margin: 20 }}>
        <form onSubmit={this.onSubmit}>
          <p>
            {form.getFieldDecorator('address', {
              initialValue: [],
              rules: [{ required: true, type: 'array' }],
            })(<CascaderInput placeholder="please select address" options={addressOptions} />)}
            <span style={{ color: '#f50' }}>
              {addressFieldError ? addressFieldError.join(' ') : null}
            </span>
          </p>
          <p>
            <button>submit</button>
          </p>
        </form>
      </div>
    );
  }
}

const NewForm = createForm()(Form);

export default NewForm;
