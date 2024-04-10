import arrayTreeFilter from 'array-tree-filter';
import Form, { Field } from 'rc-field-form';
import '../assets/index.less';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import React from 'react';
import type { Option2 } from './utils';

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

const CascaderInput = (props: any) => {
  const onChange: CascaderProps<Option2>['onChange'] = value => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const getLabel = () => {
    const value = props.value || [];
    return arrayTreeFilter(props.options, (o: any, level) => o.value === value[level])
      .map(o => o.label)
      .join(', ');
  };

  return (
    <Cascader {...props} onChange={onChange}>
      <input placeholder={props.placeholder} value={getLabel()} readOnly />
    </Cascader>
  );
};

const Demo = () => {
  return (
    <div style={{ margin: 20 }}>
      <Form
        onFinish={values => {
          console.error('values', values);
        }}
        initialValues={{ address: [] }}
      >
        <p>
          <Field name="address" rules={[{ required: true, type: 'array' }]}>
            <CascaderInput placeholder="please select address" options={addressOptions} />
          </Field>
          <Field shouldUpdate>
            {(_, __, { getFieldError }) => {
              const hasErrors = getFieldError('address');
              return <div style={{ color: '#f50' }}>{hasErrors ? hasErrors.join(' ') : null}</div>;
            }}
          </Field>
        </p>
        <p>
          <button>submit</button>
        </p>
      </Form>
    </div>
  );
};

export default Demo;
