import * as React from 'react';
import useId from 'rc-select/lib/hooks/useId';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { Placement } from 'rc-select/lib/BaseSelect';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate, BaseSelectProps } from 'rc-select';
import { BaseSelect } from 'rc-select';
import OptionList from './OptionList';
import CascaderContext from './context';
import { fillFieldNames, toPathKey, toPathKeys } from './utils/commonUtil';
import useDisplayValues from './hooks/useDisplayValues';
import useRefFunc from './hooks/useRefFunc';
import useEntities from './hooks/useEntities';
import { formatStrategyValues, toPathOptions } from './utils/treeUtil';
import useSearchConfig from './hooks/useSearchConfig';
import useSearchOptions from './hooks/useSearchOptions';
import warning from 'rc-util/lib/warning';
import useMissingValues from './hooks/useMissingValues';

export interface ShowSearchType<OptionType extends BaseOptionType = DefaultOptionType> {
  filter?: (inputValue: string, options: OptionType[], fieldNames: FieldNames) => boolean;
  render?: (
    inputValue: string,
    path: OptionType[],
    prefixCls: string,
    fieldNames: FieldNames,
  ) => React.ReactNode;
  sort?: (a: OptionType[], b: OptionType[], inputValue: string, fieldNames: FieldNames) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

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
  extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'labelInValue' | 'mode' | 'showSearch'
  > {
  // MISC
  id?: string;
  prefixCls?: string;
  fieldNames?: FieldNames;
  children?: React.ReactElement;

  // Value
  value?: ValueType;
  defaultValue?: ValueType;
  changeOnSelect?: boolean;
  onChange?: (value: ValueType, selectedOptions?: OptionType[] | OptionType[][]) => void;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  checkable?: boolean | React.ReactNode;

  // Search
  showSearch?: boolean | ShowSearchType<OptionType>;
  searchValue?: string;
  onSearch?: (value: string) => void;

  // Trigger
  expandTrigger?: 'hover' | 'click';

  // Options
  options?: OptionType[];
  /** @private Internal usage. Do not use in your production. */
  dropdownPrefixCls?: string;
  loadData?: (selectOptions: OptionType[]) => void;

  // Open
  /** @deprecated Use `open` instead */
  popupVisible?: boolean;

  /** @deprecated Use `dropdownClassName` instead */
  popupClassName?: string;
  dropdownClassName?: string;

  /** @deprecated Use `placement` instead */
  popupPlacement?: Placement;
  placement?: Placement;

  /** @deprecated Use `onDropdownVisibleChange` instead */
  onPopupVisibleChange?: (open: boolean) => void;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Icon
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
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

  return value.length === 0 ? [] : [value];
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
    showSearch,

    // Trigger
    expandTrigger,

    // Options
    options,
    dropdownPrefixCls,
    loadData,

    // Open
    popupVisible,
    open,

    popupClassName,
    dropdownClassName,

    popupPlacement,
    placement,

    onDropdownVisibleChange,
    onPopupVisibleChange,

    // Icon
    expandIcon = '>',
    loadingIcon,

    // Children
    children,
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

  // =========================== Option ===========================
  const mergedOptions = React.useMemo(() => options || [], [options]);

  // Only used in multiple mode, this fn will not call in single mode
  const getPathKeyEntities = useEntities(mergedOptions, mergedFieldNames);

  /** Convert path key back to value format */
  const getValueByKeyPath = React.useCallback(
    (pathKeys: React.Key[]): SingleValueType[] => {
      const ketPathEntities = getPathKeyEntities();

      return pathKeys.map(pathKey => {
        const { nodes } = ketPathEntities[pathKey];

        return nodes.map(node => node[mergedFieldNames.value]);
      });
    },
    [getPathKeyEntities, mergedFieldNames],
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

  const [mergedShowSearch, searchConfig] = useSearchConfig(showSearch);

  const searchOptions = useSearchOptions(
    searchValue,
    mergedOptions,
    mergedFieldNames,
    prefixCls,
    searchConfig,
    changeOnSelect,
  );

  // =========================== Values ===========================
  const getMissingValues = useMissingValues(mergedOptions, mergedFieldNames);

  // Fill `rawValues` with checked conduction values
  const [checkedValues, halfCheckedValues] = React.useMemo(() => {
    if (!multiple || !rawValues.length) {
      return [rawValues, []];
    }

    const keyPathValues = toPathKeys(rawValues);
    const ketPathEntities = getPathKeyEntities();

    const { checkedKeys, halfCheckedKeys } = conductCheck(keyPathValues, true, ketPathEntities);

    // Convert key back to value cells
    return [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys)];
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath]);

  const deDuplicatedValues = React.useMemo(() => {
    const [existValues, missingValues] = getMissingValues(checkedValues);
    const checkedKeys = toPathKeys(existValues);
    const deduplicateKeys = formatStrategyValues(checkedKeys, getPathKeyEntities);

    return [...missingValues, ...getValueByKeyPath(deduplicateKeys)];
  }, [checkedValues, getPathKeyEntities, getValueByKeyPath, getMissingValues]);

  const displayValues = useDisplayValues(
    deDuplicatedValues,
    mergedOptions,
    mergedFieldNames,
    displayRender,
  );

  // =========================== Change ===========================
  const triggerChange = useRefFunc((nextValues: ValueType) => {
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
  const onInternalSelect = useRefFunc((valuePath: SingleValueType, leaf: boolean) => {
    if (!multiple) {
      triggerChange(valuePath);
    } else {
      // Prepare conduct required info
      const pathKey = toPathKey(valuePath);
      const checkedPathKeys = toPathKeys(checkedValues);
      const halfCheckedPathKeys = toPathKeys(halfCheckedValues);

      const nextSelected = !checkedPathKeys.includes(pathKey);
      const nextRawCheckedKeys = nextSelected
        ? [...checkedPathKeys, pathKey]
        : checkedPathKeys.filter(key => key !== pathKey);
      const pathKeyEntities = getPathKeyEntities();

      // Conduction by selected or not
      let checkedKeys: React.Key[];
      if (nextSelected) {
        ({ checkedKeys } = conductCheck(nextRawCheckedKeys, true, pathKeyEntities));
      } else {
        ({ checkedKeys } = conductCheck(
          nextRawCheckedKeys,
          { checked: false, halfCheckedKeys: halfCheckedPathKeys },
          pathKeyEntities,
        ));
      }

      // Roll up to parent level keys
      const deDuplicatedKeys = formatStrategyValues(checkedKeys, getPathKeyEntities);
      const nextValues = getValueByKeyPath(deDuplicatedKeys);

      triggerChange(nextValues);
    }
  });

  // Display Value change logic
  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (value, info) => {
    if (info.type === 'clear') {
      triggerChange([]);
    }

    // Cascader do not support `add` type. Only support `remove`
    const pathKey = info.values[0].value;
    const valueCells = getValueByKeyPath([pathKey])[0];
    onInternalSelect(valueCells, null);
  };

  // ============================ Open ============================
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !onPopupVisibleChange,
      '`onPopupVisibleChange` is deprecated. Please use `onDropdownVisibleChange` instead.',
    );
    warning(popupVisible === undefined, '`popupVisible` is deprecated. Please use `open` instead.');
    warning(
      popupClassName === undefined,
      '`popupClassName` is deprecated. Please use `dropdownClassName` instead.',
    );
    warning(
      popupPlacement === undefined,
      '`popupPlacement` is deprecated. Please use `placement` instead.',
    );
  }

  const mergedOpen = open !== undefined ? open : popupVisible;

  const mergedDropdownClassName = dropdownClassName || popupClassName;

  const mergedPlacement = placement || popupPlacement;

  const onInternalDropdownVisibleChange = (nextVisible: boolean) => {
    onDropdownVisibleChange?.(nextVisible);
    onPopupVisibleChange?.(nextVisible);
  };

  // ========================== Context ===========================
  const cascaderContext = React.useMemo(
    () => ({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: checkedValues,
      halfValues: halfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable,
      searchOptions,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
    }),
    [
      mergedOptions,
      mergedFieldNames,
      checkedValues,
      halfCheckedValues,
      changeOnSelect,
      onInternalSelect,
      checkable,
      searchOptions,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
    ],
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
        onDisplayValuesChange={onDisplayValuesChange}
        mode={multiple ? 'multiple' : undefined}
        // Search
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        showSearch={mergedShowSearch}
        // Options
        OptionList={OptionList}
        emptyOptions={!(mergedSearchValue ? searchOptions : mergedOptions).length}
        // Open
        open={mergedOpen}
        dropdownClassName={mergedDropdownClassName}
        placement={mergedPlacement}
        onDropdownVisibleChange={onInternalDropdownVisibleChange}
        // Children
        getRawInputElement={() => children}
      />
    </CascaderContext.Provider>
  );
});

if (process.env.NODE_ENV === 'development') {
  Cascader.displayName = 'Cascader';
}

export default Cascader;
