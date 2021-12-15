import * as React from 'react';
import useId from 'rc-select/lib/hooks/useId';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from 'rc-select';
import { BaseSelect } from 'rc-select';
import OptionList from './OptionList';
import CascaderContext from './context';
import { fillFieldNames, toArray } from './utils/commonUtil';
import useDisplayValues from './hooks/useDisplayValues';
import useRefFunc from './hooks/useRefFunc';

export interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
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
  multiple?: boolean;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;

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
    multiple,
    displayRender,

    // Search
    searchValue,
    onSearch,

    // Options
    options,
  } = props;

  const mergedId = useId(id);

  // =========================== Values ===========================
  const [rawValues, setRawValues] = useMergedState<ValueType, SingleValueType[]>(defaultValue, {
    value,
    postState: (val): SingleValueType[] => {
      if (!val) {
        return [];
      }

      if (isMultipleValue(val)) {
        return val;
      }

      return [val];
    },
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

  // =========================== Values ===========================
  const displayValues = useDisplayValues(rawValues, mergedOptions, mergedFieldNames, displayRender);

  // =========================== Select ===========================
  const onInternalSelect = useRefFunc((valuePath: SingleValueType, leaf: boolean) => {
    console.log('>>>>>>>>', valuePath, leaf);
  });

  // ========================== Context ===========================
  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: rawValues,
      changeOnSelect,
      onSelect: onInternalSelect,
    }),
    [mergedOptions, mergedFieldNames, rawValues, changeOnSelect, onInternalSelect],
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
