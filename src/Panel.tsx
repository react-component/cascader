import { useMergedState } from 'rc-util';
import * as React from 'react';
import type { CascaderProps, SingleValueType, ValueType } from './Cascader';
import CascaderContext from './context';
import useValues from './hooks/useValues';
import RawOptionList from './OptionList/List';
import { toRawValues } from './utils/commonUtil';

export type PanelProps = Pick<
  CascaderProps,
  'value' | 'defaultValue' | 'changeOnSelect' | 'onChange' | 'options' | 'prefixCls' | 'checkable'
>;

export default function Panel(props: PanelProps) {
  const { prefixCls = 'rc-cascader', options, checkable, defaultValue, value } = props;

  // ======================== Multiple ========================
  const multiple = !!checkable;

  // ========================= Values =========================
  const [rawValues, setRawValues] = useMergedState<ValueType, SingleValueType[]>(defaultValue, {
    value,
    postState: toRawValues,
  });

  // Fill `rawValues` with checked conduction values
  const [checkedValues, halfCheckedValues, missingCheckedValues] = useValues(
    multiple,
    rawValues,
    getPathKeyEntities,
    getValueByKeyPath,
    getMissingValues,
  );

  // ======================== Context =========================
  const context = React.useMemo(() => ({ options }), [options]);

  // ========================= Render =========================
  return (
    <CascaderContext.Provider value={context}>
      <RawOptionList prefixCls={prefixCls} />
    </CascaderContext.Provider>
  );
}
