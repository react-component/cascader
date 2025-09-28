import { clsx } from 'clsx';
import { useEvent, useControlledState } from '@rc-component/util';
import * as React from 'react';
import type {
  CascaderProps,
  DefaultOptionType,
  InternalCascaderProps,
  InternalValueType,
  SingleValueType,
} from './Cascader';
import type { CascaderContextProps } from './context';
import CascaderContext from './context';
import useMissingValues from './hooks/useMissingValues';
import useOptions from './hooks/useOptions';
import useSelect from './hooks/useSelect';
import useValues from './hooks/useValues';
import RawOptionList from './OptionList/List';
import { fillFieldNames, toRawValues } from './utils/commonUtil';
import { toPathOptions } from './utils/treeUtil';

export type PickType =
  | 'value'
  | 'defaultValue'
  | 'changeOnSelect'
  | 'onChange'
  | 'options'
  | 'prefixCls'
  | 'checkable'
  | 'fieldNames'
  | 'showCheckedStrategy'
  | 'loadData'
  | 'expandTrigger'
  | 'expandIcon'
  | 'loadingIcon'
  | 'className'
  | 'style'
  | 'direction'
  | 'notFoundContent'
  | 'disabled'
  | 'optionRender';

export type PanelProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean | React.ReactNode = false,
> = Pick<CascaderProps<OptionType, ValueField, Multiple>, PickType>;

function noop() {}

export default function Panel<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean | React.ReactNode = false,
>(props: PanelProps<OptionType, ValueField, Multiple>) {
  const {
    prefixCls = 'rc-cascader',
    style,
    className,
    options,
    checkable,
    defaultValue,
    value,
    fieldNames,
    changeOnSelect,
    onChange,
    showCheckedStrategy,
    loadData,
    expandTrigger,
    expandIcon = '>',
    loadingIcon,
    direction,
    notFoundContent = 'Not Found',
    disabled,
    optionRender,
  } = props as Pick<InternalCascaderProps, PickType>;

  // ======================== Multiple ========================
  const multiple = !!checkable;

  // ========================= Values =========================
  const [interanlRawValues, setRawValues] = useControlledState(defaultValue, value);
  const rawValues = toRawValues(interanlRawValues);

  // ========================= FieldNames =========================
  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  // =========================== Option ===========================
  const [mergedOptions, getPathKeyEntities, getValueByKeyPath] = useOptions(
    mergedFieldNames,
    options,
  );

  // ========================= Values =========================
  const getMissingValues = useMissingValues(mergedOptions, mergedFieldNames);

  // Fill `rawValues` with checked conduction values
  const [checkedValues, halfCheckedValues, missingCheckedValues] = useValues(
    multiple,
    rawValues,
    getPathKeyEntities,
    getValueByKeyPath,
    getMissingValues,
  );

  // =========================== Change ===========================
  const triggerChange = useEvent((nextValues: InternalValueType) => {
    setRawValues(nextValues);

    // Save perf if no need trigger event
    if (onChange) {
      const nextRawValues = toRawValues(nextValues);

      const valueOptions = nextRawValues.map(valueCells =>
        toPathOptions(valueCells, mergedOptions, mergedFieldNames).map(valueOpt => valueOpt.option),
      );

      const triggerValues = multiple ? nextRawValues : nextRawValues[0];
      const triggerOptions = multiple ? valueOptions : valueOptions[0];

      onChange(triggerValues, triggerOptions);
    }
  });

  // =========================== Select ===========================
  const handleSelection = useSelect(
    multiple,
    triggerChange,
    checkedValues,
    halfCheckedValues,
    missingCheckedValues,
    getPathKeyEntities,
    getValueByKeyPath,
    showCheckedStrategy,
  );

  const onInternalSelect = useEvent((valuePath: SingleValueType) => {
    handleSelection(valuePath);
  });

  // ======================== Context =========================
  const cascaderContext = React.useMemo<CascaderContextProps>(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: checkedValues,
      halfValues: halfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable,
      searchOptions: [],
      popupPrefixCls: undefined,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      popupMenuColumnStyle: undefined,
      optionRender,
    }),
    [
      mergedOptions,
      mergedFieldNames,
      checkedValues,
      halfCheckedValues,
      changeOnSelect,
      onInternalSelect,
      checkable,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      optionRender,
    ],
  );

  // ========================= Render =========================
  const panelPrefixCls = `${prefixCls}-panel`;
  const isEmpty = !mergedOptions.length;

  return (
    <CascaderContext.Provider value={cascaderContext}>
      <div
        className={clsx(
          panelPrefixCls,
          { [`${panelPrefixCls}-rtl`]: direction === 'rtl', [`${panelPrefixCls}-empty`]: isEmpty },
          className,
        )}
        style={style}
      >
        {isEmpty ? (
          notFoundContent
        ) : (
          <RawOptionList
            prefixCls={prefixCls}
            searchValue=""
            multiple={multiple}
            toggleOpen={noop}
            open
            direction={direction}
            disabled={disabled}
          />
        )}
      </div>
    </CascaderContext.Provider>
  );
}
