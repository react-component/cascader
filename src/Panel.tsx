import * as React from 'react';
import type { CascaderProps } from './Cascader';
import CascaderContext from './context';
import RawOptionList from './OptionList/List';

export type PanelProps = Pick<
  CascaderProps,
  'value' | 'defaultValue' | 'changeOnSelect' | 'onChange' | 'options' | 'prefixCls'
>;

export default function Panel(props: PanelProps) {
  const { prefixCls = 'rc-cascader', options } = props;

  // ======================== Context =========================
  const context = React.useMemo(() => ({ options }), [options]);

  // ========================= Render =========================
  return (
    <CascaderContext.Provider value={context}>
      <RawOptionList prefixCls={prefixCls} />
    </CascaderContext.Provider>
  );
}
