import type { BaseSelectProps, BaseSelectPropsWithoutPrivate, BaseSelectRef } from 'rc-select';
import { BaseSelect } from 'rc-select';
import type { DisplayValueType, Placement } from 'rc-select/lib/BaseSelect';
import useId from 'rc-select/lib/hooks/useId';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import CascaderContext from './context';
import useDisplayValues from './hooks/useDisplayValues';
import useEntities from './hooks/useEntities';
import useMissingValues from './hooks/useMissingValues';
import useRefFunc from './hooks/useRefFunc';
import useSearchConfig from './hooks/useSearchConfig';
import useSearchOptions from './hooks/useSearchOptions';
import OptionList from './OptionList';
import { fillFieldNames, SHOW_CHILD, SHOW_PARENT, toPathKey, toPathKeys } from './utils/commonUtil';
import { formatStrategyValues, toPathOptions } from './utils/treeUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

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
export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
  label: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
}

interface BaseCascaderProps<OptionType extends BaseOptionType = DefaultOptionType>
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
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  checkable?: boolean | React.ReactNode;
  showCheckedStrategy?: ShowCheckedStrategy;

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
  dropdownMenuColumnStyle?: React.CSSProperties;

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

type OnSingleChange<OptionType> = (value: SingleValueType, selectOptions: OptionType[]) => void;
type OnMultipleChange<OptionType> = (
  value: SingleValueType[],
  selectOptions: OptionType[][],
) => void;

export interface SingleCascaderProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends BaseCascaderProps<OptionType> {
  checkable?: false;

  onChange?: OnSingleChange<OptionType>;
}

export interface MultipleCascaderProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends BaseCascaderProps<OptionType> {
  checkable: true | React.ReactNode;

  onChange?: OnMultipleChange<OptionType>;
}

export type CascaderProps<OptionType extends BaseOptionType = DefaultOptionType> =
  | SingleCascaderProps<OptionType>
  | MultipleCascaderProps<OptionType>;

export type InternalCascaderProps<OptionType extends BaseOptionType = DefaultOptionType> = Omit<
  SingleCascaderProps<OptionType> | MultipleCascaderProps<OptionType>,
  'onChange'
> & {
  onChange?: (
    value: SingleValueType | SingleValueType[],
    selectOptions: OptionType[] | OptionType[][],
  ) => void;
};

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

  return (value.length === 0 ? [] : [value]).map(val => (Array.isArray(val) ? val : [val]));
}

const Cascader = React.forwardRef<CascaderRef, InternalCascaderProps>((props, ref) => {
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
    dropdownMenuColumnStyle,

    popupPlacement,
    placement,

    onDropdownVisibleChange,
    onPopupVisibleChange,

    // Icon
    expandIcon = '>',
    loadingIcon,

    // Children
    children,
    dropdownMatchSelectWidth = false,
    showCheckedStrategy = SHOW_PARENT,
    ...restProps
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
      const keyPathEntities = getPathKeyEntities();

      return pathKeys.map(pathKey => {
        const { nodes } = keyPathEntities[pathKey];

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
    mergedSearchValue,
    mergedOptions,
    mergedFieldNames,
    dropdownPrefixCls || prefixCls,
    searchConfig,
    changeOnSelect,
  );

  // =========================== Values ===========================
  const getMissingValues = useMissingValues(mergedOptions, mergedFieldNames);

  // Fill `rawValues` with checked conduction values
  const [checkedValues, halfCheckedValues, missingCheckedValues] = React.useMemo(() => {
    const [existValues, missingValues] = getMissingValues(rawValues);

    if (!multiple || !rawValues.length) {
      return [existValues, [], missingValues];
    }

    const keyPathValues = toPathKeys(existValues);
    const keyPathEntities = getPathKeyEntities();

    const { checkedKeys, halfCheckedKeys } = conductCheck(keyPathValues, true, keyPathEntities);

    // Convert key back to value cells
    return [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys), missingValues];
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath, getMissingValues]);

  const deDuplicatedValues = React.useMemo(() => {
    const checkedKeys = toPathKeys(checkedValues);
    const deduplicateKeys = formatStrategyValues(
      checkedKeys,
      getPathKeyEntities,
      showCheckedStrategy,
    );

    return [...missingCheckedValues, ...getValueByKeyPath(deduplicateKeys)];
  }, [
    checkedValues,
    getPathKeyEntities,
    getValueByKeyPath,
    missingCheckedValues,
    showCheckedStrategy,
  ]);

  const displayValues = useDisplayValues(
    deDuplicatedValues,
    mergedOptions,
    mergedFieldNames,
    multiple,
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
  const onInternalSelect = useRefFunc((valuePath: SingleValueType) => {
    setSearchValue('');
    if (!multiple) {
      triggerChange(valuePath);
    } else {
      // Prepare conduct required info
      const pathKey = toPathKey(valuePath);
      const checkedPathKeys = toPathKeys(checkedValues);
      const halfCheckedPathKeys = toPathKeys(halfCheckedValues);

      const existInChecked = checkedPathKeys.includes(pathKey);
      const existInMissing = missingCheckedValues.some(
        valueCells => toPathKey(valueCells) === pathKey,
      );

      // Do update
      let nextCheckedValues = checkedValues;
      let nextMissingValues = missingCheckedValues;

      if (existInMissing && !existInChecked) {
        // Missing value only do filter
        nextMissingValues = missingCheckedValues.filter(
          valueCells => toPathKey(valueCells) !== pathKey,
        );
      } else {
        // Update checked key first
        const nextRawCheckedKeys = existInChecked
          ? checkedPathKeys.filter(key => key !== pathKey)
          : [...checkedPathKeys, pathKey];

        const pathKeyEntities = getPathKeyEntities();

        // Conduction by selected or not
        let checkedKeys: React.Key[];
        if (existInChecked) {
          ({ checkedKeys } = conductCheck(
            nextRawCheckedKeys,
            { checked: false, halfCheckedKeys: halfCheckedPathKeys },
            pathKeyEntities,
          ));
        } else {
          ({ checkedKeys } = conductCheck(nextRawCheckedKeys, true, pathKeyEntities));
        }

        // Roll up to parent level keys
        const deDuplicatedKeys = formatStrategyValues(
          checkedKeys,
          getPathKeyEntities,
          showCheckedStrategy,
        );
        nextCheckedValues = getValueByKeyPath(deDuplicatedKeys);
      }

      triggerChange([...nextMissingValues, ...nextCheckedValues]);
    }
  });

  // Display Value change logic
  const onDisplayValuesChange: BaseSelectProps['onDisplayValuesChange'] = (_, info) => {
    if (info.type === 'clear') {
      triggerChange([]);
      return;
    }

    // Cascader do not support `add` type. Only support `remove`
    const { valueCells } = info.values[0] as DisplayValueType & { valueCells: SingleValueType };
    onInternalSelect(valueCells);
  };

  // ============================ Open ============================
  const mergedOpen = open !== undefined ? open : popupVisible;

  const mergedDropdownClassName = dropdownClassName || popupClassName;

  const mergedPlacement = placement || popupPlacement;

  const onInternalDropdownVisibleChange = (nextVisible: boolean) => {
    onDropdownVisibleChange?.(nextVisible);
    onPopupVisibleChange?.(nextVisible);
  };

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningProps(props);
    warningNullOptions(mergedOptions, mergedFieldNames);
  }

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
      dropdownMenuColumnStyle,
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
      dropdownMenuColumnStyle,
    ],
  );

  // ==============================================================
  // ==                          Render                          ==
  // ==============================================================
  const emptyOptions = !(mergedSearchValue ? searchOptions : mergedOptions).length;

  const dropdownStyle: React.CSSProperties =
    // Search to match width
    (mergedSearchValue && searchConfig.matchInputWidth) ||
    // Empty keep the width
    emptyOptions
      ? {}
      : {
          minWidth: 'auto',
        };

  return (
    <CascaderContext.Provider value={cascaderContext}>
      <BaseSelect
        {...restProps}
        // MISC
        ref={ref as any}
        id={mergedId}
        prefixCls={prefixCls}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        dropdownStyle={dropdownStyle}
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
        emptyOptions={emptyOptions}
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
}) as unknown as (<OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  props: React.PropsWithChildren<CascaderProps<OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
};

if (process.env.NODE_ENV !== 'production') {
  Cascader.displayName = 'Cascader';
}

Cascader.SHOW_PARENT = SHOW_PARENT;
Cascader.SHOW_CHILD = SHOW_CHILD;
export default Cascader;
