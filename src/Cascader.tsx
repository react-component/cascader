import type { BuildInPlacements } from '@rc-component/trigger/lib/interface';
import type { BaseSelectProps, BaseSelectPropsWithoutPrivate, BaseSelectRef } from 'rc-select';
import { BaseSelect } from 'rc-select';
import type { DisplayValueType, Placement } from 'rc-select/lib/BaseSelect';
import useId from 'rc-select/lib/hooks/useId';
import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import CascaderContext from './context';
import useDisplayValues from './hooks/useDisplayValues';
import useMissingValues from './hooks/useMissingValues';
import useOptions from './hooks/useOptions';
import useSearchConfig from './hooks/useSearchConfig';
import useSearchOptions from './hooks/useSearchOptions';
import useSelect from './hooks/useSelect';
import useValues from './hooks/useValues';
import OptionList from './OptionList';
import Panel from './Panel';
import {
  fillFieldNames,
  SHOW_CHILD,
  SHOW_PARENT,
  toPathKeys,
  toRawValues,
} from './utils/commonUtil';
import { formatStrategyValues, toPathOptions } from './utils/treeUtil';
import warningProps, { warningNullOptions } from './utils/warningPropsUtil';

export interface BaseOptionType {
  disabled?: boolean;
  disableCheckbox?: boolean;
  label?: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
  [name: string]: any;
}

export type DefaultOptionType = BaseOptionType;

export interface ShowSearchType<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> {
  filter?: (
    inputValue: string,
    options: OptionType[],
    fieldNames: FieldNames<OptionType, T>,
  ) => boolean;
  render?: (
    inputValue: string,
    path: OptionType[],
    prefixCls: string,
    fieldNames: FieldNames<OptionType, T>,
  ) => React.ReactNode;
  sort?: (
    a: OptionType[],
    b: OptionType[],
    inputValue: string,
    fieldNames: FieldNames<OptionType, T>,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

export interface FieldNames<
  OptionType extends DefaultOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> {
  label?: T;
  value?: T;
  children?: T;
}

export interface InternalFieldNames extends Required<FieldNames> {
  key: string;
}

export type ValueType<
  OptionType extends DefaultOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> = keyof OptionType extends T ? OptionType['value'] : OptionType[T];

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

interface BaseCascaderProps<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'labelInValue' | 'mode' | 'showSearch'
  > {
  // MISC
  id?: string;
  prefixCls?: string;
  fieldNames?: FieldNames<OptionType, T>;
  optionRender?: (option: OptionType) => React.ReactNode;
  children?: React.ReactElement;

  // Value
  changeOnSelect?: boolean;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  checkable?: boolean | React.ReactNode;
  showCheckedStrategy?: ShowCheckedStrategy;

  // Search
  autoClearSearchValue?: boolean;
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
  builtinPlacements?: BuildInPlacements;

  /** @deprecated Use `onDropdownVisibleChange` instead */
  onPopupVisibleChange?: (open: boolean) => void;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Icon
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

export interface SingleCascaderProps<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> extends BaseCascaderProps<OptionType, T> {
  checkable?: false;
  value?: ValueType<OptionType, T>[];
  defaultValue?: ValueType<OptionType, T>[];
  onChange?: (value: NonNullable<ValueType<OptionType, T>>[], selectOptions: OptionType[]) => void;
}

export interface MultipleCascaderProps<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> extends BaseCascaderProps<OptionType, T> {
  checkable: true | NonNullable<React.ReactNode>;
  value?: ValueType<OptionType, T>[][];
  defaultValue?: ValueType<OptionType, T>[][];
  onChange?: (
    value: NonNullable<ValueType<OptionType, T>>[][],
    selectOptions: OptionType[],
  ) => void;
}

export type CascaderProps<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> = SingleCascaderProps<OptionType, T> | MultipleCascaderProps<OptionType, T>;

export type SingleValueType = (string | number)[];
export type InternalValueType = SingleValueType | SingleValueType[];

export type InternalCascaderProps<OptionType extends BaseOptionType = DefaultOptionType> = Omit<
  SingleCascaderProps<OptionType> | MultipleCascaderProps<OptionType>,
  'onChange' | 'value' | 'defaultValue'
> & {
  value?: InternalValueType | InternalValueType[];
  defaultValue?: InternalValueType | InternalValueType[];
  onChange?: (
    value: InternalValueType | InternalValueType[],
    selectOptions: OptionType[] | OptionType[][],
  ) => void;
};

export type CascaderRef = Omit<BaseSelectRef, 'scrollTo'>;

const Cascader = React.forwardRef<CascaderRef, InternalCascaderProps>((props, ref) => {
  const {
    // MISC
    id,
    prefixCls = 'rc-cascader',
    fieldNames,

    // Value
    defaultValue = [],
    value,
    changeOnSelect = false,
    onChange,
    displayRender,
    checkable,

    // Search
    autoClearSearchValue = true,
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
    dropdownStyle: customDropdownStyle,

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
    optionRender,
    ...restProps
  } = props;

  const mergedId = useId(id);
  const multiple = !!checkable;

  // =========================== Values ===========================
  const [rawValues, setRawValues] = useMergedState<
    InternalValueType | InternalValueType[],
    SingleValueType[]
  >(defaultValue, {
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
  const [mergedOptions, getPathKeyEntities, getValueByKeyPath] = useOptions(
    mergedFieldNames,
    options,
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
  const [checkedValues, halfCheckedValues, missingCheckedValues] = useValues(
    multiple,
    rawValues,
    getPathKeyEntities,
    getValueByKeyPath,
    getMissingValues,
  );

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
  const triggerChange = useEvent((nextValues: any[]) => {
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
    if (!multiple || autoClearSearchValue) {
      setSearchValue('');
    }

    handleSelection(valuePath);
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
      searchOptions,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      dropdownMenuColumnStyle,
      optionRender,
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
        autoClearSearchValue={autoClearSearchValue}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
        dropdownStyle={{
          ...dropdownStyle,
          ...customDropdownStyle,
        }}
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
        getRawInputElement={() => children as React.ReactElement}
      />
    </CascaderContext.Provider>
  );
}) as unknown as (<
  OptionType extends BaseOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
>(
  props: React.PropsWithChildren<CascaderProps<OptionType, T>> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  displayName?: string;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
  Panel: typeof Panel;
};

if (process.env.NODE_ENV !== 'production') {
  Cascader.displayName = 'Cascader';
}

Cascader.SHOW_PARENT = SHOW_PARENT;
Cascader.SHOW_CHILD = SHOW_CHILD;
Cascader.Panel = Panel;

export default Cascader;
