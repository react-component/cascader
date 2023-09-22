import * as React from 'react';
import type { CascaderProps } from './Cascader';
import OptionList from './OptionList';

export type PanelProps = Pick<
  CascaderProps,
  'value' | 'defaultValue' | 'changeOnSelect' | 'onChange' | 'options' | 'prefixCls'
>;

export default function Panel(props: PanelProps) {
  const { prefixCls = 'rc-cascader' } = props;

  

  return <OptionList />;
}
