import * as React from 'react';
import useId from 'rc-select/lib/hooks/useId';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from 'rc-select';
import { BaseSelect } from 'rc-select';
import OptionList from './OptionList';
import CascaderContext from './context';
import { fillFieldNames, VALUE_SPLIT } from './utils/commonUtil';
import useDisplayValues from './hooks/useDisplayValues';
import useRefFunc from './hooks/useRefFunc';
import useEntities from './hooks/useEntities';
import { formatStrategyValues } from './utils/treeUtil';

export interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
}

export interface InternalFieldNames extends Required<FieldNames> {
  key: string;
}

export type SingleValueType = (string | number)[];

export type ValueType = SingleValueType | SingleValueType[];

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
}

export interface CascaderProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends Omit<BaseSelectPropsWithoutPrivate, 'tokenSeparators' | 'labelInValue' | 'mode'> {
  // MISC
  id?: string;
  prefixCls?: string;
  fieldNames?: FieldNames;

  // Value
  value?: ValueType;
  defaultValue?: ValueType;
  changeOnSelect?: boolean;
  onChange?: (value: ValueType, selectedOptions?: OptionType[]) => void;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  checkable?: boolean | React.ReactNode;

  // Search
  searchValue?: string;
  onSearch?: (value: string) => void;

  // Options
  options?: OptionType[];
}

export type CascaderRef = Omit<BaseSelectRef, 'scrollTo'>;

function isMultipleValue(value: ValueType): value is SingleValueType[] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

function toRawValues(value: ValueType): SingleValueType[] {
  if (!value) {
    return [];
  }

  if (isMultipleValue(value)) {
    return value;
  }

  return [value];
}

function toKeyPath(value: SingleValueType[]) {
  return value.map(valCells => valCells.join(VALUE_SPLIT));
}

const Cascader = React.forwardRef<CascaderRef, CascaderProps>((props, ref) => {
  const {
    // MISC
    id,
    prefixCls = 'rc-cascader',
    fieldNames,

    // Value
    defaultValue,
    value,
    changeOnSelect,
    onChange,
    displayRender,
    checkable,

    // Search
    searchValue,
    onSearch,

    // Options
    options,
  } = props;

  const mergedId = useId(id);
  const multiple = !!checkable;

  // =========================== Values ===========================
  const [rawValues, setRawValues] = useMergedState<ValueType, SingleValueType[]>(defaultValue, {
    value,
    postState: toRawValues,
  });

  // ========================= FieldNames =========================
  const mergedFieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  // =========================== Search ===========================
  const [mergedSearchValue, setSearchValue] = useMergedState('', {
    value: searchValue,
    postState: search => search || '',
  });

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
    setSearchValue(searchText);

    if (info.source !== 'blur' && onSearch) {
      onSearch(searchText);
    }
  };

  // =========================== Option ===========================
  const mergedOptions = React.useMemo(() => options || [], [options]);

  // Only used in multiple mode, this fn will not call in single mode
  const getPathKeyEntities = useEntities(mergedOptions, mergedFieldNames);

  /** Convert path key back to value format */
  const getValueByKeyPath = React.useCallback(
    (pathKeys: React.Key[]) => {
      const ketPathEntities = getPathKeyEntities();

      return pathKeys.map(pathKey => {
        const { nodes } = ketPathEntities[pathKey];

        return nodes.map(node => node[mergedFieldNames.value]);
      });
    },
    [getPathKeyEntities, mergedFieldNames],
  );

  // =========================== Values ===========================
  // Fill `rawValues` with checked conduction values
  const fullValues = React.useMemo(() => {
    if (!multiple) {
      return rawValues;
    }

    const keyPathValues = toKeyPath(rawValues);
    const ketPathEntities = getPathKeyEntities();

    const { checkedKeys } = conductCheck(keyPathValues, true, ketPathEntities);

    // Convert key back to value cells
    return getValueByKeyPath(checkedKeys);
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath]);

  const deDuplicatedValues = React.useMemo(() => {
    const checkedKeys = toKeyPath(fullValues);
    const deduplicateKeys = formatStrategyValues(checkedKeys, getPathKeyEntities);

    return getValueByKeyPath(deduplicateKeys);
  }, [fullValues, getPathKeyEntities, getValueByKeyPath]);

  const displayValues = useDisplayValues(
    deDuplicatedValues,
    mergedOptions,
    mergedFieldNames,
    displayRender,
  );

  // =========================== Change ===========================
  const triggerChange = useRefFunc((nextValues: ValueType) => {
    const nextRawValues = toRawValues(nextValues);
  });

  // =========================== Select ===========================
  const onInternalSelect = useRefFunc((valuePath: SingleValueType, leaf: boolean) => {
    if (!multiple) {
      setRawValues(valuePath);
      triggerChange(valuePath);
    } else {
      // TODO: handle this
    }
  });

  // ========================== Context ===========================
  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: fullValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable,
    }),
    [mergedOptions, mergedFieldNames, fullValues, changeOnSelect, onInternalSelect, checkable],
  );

  // ==============================================================
  // ==                          Render                          ==
  // ==============================================================
  return (
    <CascaderContext.Provider value={cascaderContext}>
      <BaseSelect
        {...props}
        // MISC
        ref={ref as any}
        id={mergedId}
        prefixCls={prefixCls}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ minWidth: 'auto' }}
        // Value
        displayValues={displayValues}
        mode={multiple ? 'multiple' : undefined}
        // Search
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        // Options
        OptionList={OptionList}
      />
    </CascaderContext.Provider>
  );
});

if (process.env.NODE_ENV === 'development') {
  Cascader.displayName = 'Cascader';
}

export default Cascader;
