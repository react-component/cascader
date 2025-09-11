import type { BuildInPlacements } from '@rc-component/trigger/lib/interface';
import type {
  BaseSelectProps,
  BaseSelectPropsWithoutPrivate,
  BaseSelectRef,
} from '@rc-component/select';
import { BaseSelect } from '@rc-component/select';
import type { DisplayValueType, Placement } from '@rc-component/select/lib/BaseSelect';
import useId from '@rc-component/util/lib/hooks/useId';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
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
import { warningNullOptions } from './utils/warningPropsUtil';

export interface BaseOptionType {
  disabled?: boolean;
  disableCheckbox?: boolean;
  label?: React.ReactNode;
  value?: string | number | null;
  children?: DefaultOptionType[];
}

export type DefaultOptionType = BaseOptionType & Record<string, any>;

export interface SearchConfig<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
> {
  filter?: (
    inputValue: string,
    options: OptionType[],
    fieldNames: FieldNames<OptionType, ValueField>,
  ) => boolean;
  render?: (
    inputValue: string,
    path: OptionType[],
    prefixCls: string,
    fieldNames: FieldNames<OptionType, ValueField>,
  ) => React.ReactNode;
  sort?: (
    a: OptionType[],
    b: OptionType[],
    inputValue: string,
    fieldNames: FieldNames<OptionType, ValueField>,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;
}

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

interface BaseCascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
> extends Omit<
    BaseSelectPropsWithoutPrivate,
    'tokenSeparators' | 'labelInValue' | 'mode' | 'showSearch'
  > {
  // MISC
  id?: string;
  prefixCls?: string;
  fieldNames?: FieldNames<OptionType, ValueField>;
  optionRender?: (option: OptionType) => React.ReactNode;
  children?: React.ReactElement;

  // Value
  changeOnSelect?: boolean;
  displayRender?: (label: string[], selectedOptions?: OptionType[]) => React.ReactNode;
  checkable?: boolean | React.ReactNode;
  showCheckedStrategy?: ShowCheckedStrategy;

  // Search
  /** @deprecated please use showSearch.autoClearSearchValue */
  autoClearSearchValue?: boolean;
  showSearch?: boolean | SearchConfig<OptionType>;
  /** @deprecated please use showSearch.searchValue */
  searchValue?: string;
  /** @deprecated please use showSearch.onSearch */
  onSearch?: (value: string) => void;

  // Trigger
  expandTrigger?: 'hover' | 'click';

  // Options
  options?: OptionType[];
  /** @private Internal usage. Do not use in your production. */
  popupPrefixCls?: string;
  loadData?: (selectOptions: OptionType[]) => void;

  popupClassName?: string;
  popupMenuColumnStyle?: React.CSSProperties;

  placement?: Placement;
  builtinPlacements?: BuildInPlacements;

  onPopupVisibleChange?: (open: boolean) => void;

  // Icon
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

export interface FieldNames<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
> {
  label?: keyof OptionType;
  value?: keyof OptionType | ValueField;
  children?: keyof OptionType;
}

export type ValueType<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
> = keyof OptionType extends ValueField
  ? unknown extends OptionType['value']
    ? OptionType[ValueField]
    : OptionType['value']
  : OptionType[ValueField];

export type GetValueType<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean | React.ReactNode = false,
> = false extends Multiple
  ? ValueType<Required<OptionType>, ValueField>[]
  : ValueType<Required<OptionType>, ValueField>[][];

export type GetOptionType<
  OptionType extends DefaultOptionType = DefaultOptionType,
  Multiple extends boolean | React.ReactNode = false,
> = false extends Multiple ? OptionType[] : OptionType[][];

type SemanticName = 'input' | 'prefix' | 'suffix';
type PopupSemantic = 'list' | 'listItem';
export interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean | React.ReactNode = false,
> extends BaseCascaderProps<OptionType, ValueField> {
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    popup?: Partial<Record<PopupSemantic, React.CSSProperties>>;
  };
  classNames?: Partial<Record<SemanticName, string>> & {
    popup?: Partial<Record<PopupSemantic, string>>;
  };
  checkable?: Multiple;
  value?: GetValueType<OptionType, ValueField, Multiple>;
  defaultValue?: GetValueType<OptionType, ValueField, Multiple>;
  onChange?: (
    value: GetValueType<OptionType, ValueField, Multiple>,
    selectOptions: GetOptionType<OptionType, Multiple>,
  ) => void;
}

export type SingleValueType = (string | number)[];

export type LegacyKey = string | number;

export type InternalValueType = SingleValueType | SingleValueType[];

export interface InternalFieldNames extends Required<FieldNames> {
  key: string;
}

export type InternalCascaderProps = Omit<CascaderProps, 'onChange' | 'value' | 'defaultValue'> & {
  value?: InternalValueType;
  defaultValue?: InternalValueType;
  onChange?: (
    value: InternalValueType,
    selectOptions: BaseOptionType[] | BaseOptionType[][],
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
    defaultValue,
    value,
    changeOnSelect,
    onChange,
    displayRender,
    checkable,

    // Search
    showSearch,

    // Trigger
    expandTrigger,

    // Options
    options,
    popupPrefixCls,
    loadData,

    open,

    popupClassName,
    popupMenuColumnStyle,
    popupStyle: customPopupStyle,

    classNames,
    styles,

    placement,

    onPopupVisibleChange,

    // Icon
    expandIcon = '>',
    loadingIcon,

    // Children
    children,
    popupMatchSelectWidth = false,
    showCheckedStrategy = SHOW_PARENT,
    optionRender,
    ...restProps
  } = props;

  const mergedId = useId(id);
  const multiple = !!checkable;

  // =========================== Values ===========================
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

  // =========================== Search ===========================
  const [mergedShowSearch, searchConfig] = useSearchConfig(showSearch, props);
  const { autoClearSearchValue = true, searchValue, onSearch } = searchConfig;
  const [internalSearchValue, setSearchValue] = useControlledState('', searchValue);
  const mergedSearchValue = internalSearchValue || '';

  const onInternalSearch: BaseSelectProps['onSearch'] = (searchText, info) => {
    setSearchValue(searchText);
    if (info.source !== 'blur' && onSearch) {
      onSearch(searchText);
    }
  };

  const searchOptions = useSearchOptions(
    mergedSearchValue,
    mergedOptions,
    mergedFieldNames,
    popupPrefixCls || prefixCls,
    searchConfig,
    changeOnSelect || multiple,
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

  const onInternalPopupVisibleChange = (nextVisible: boolean) => {
    onPopupVisibleChange?.(nextVisible);
  };

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningNullOptions(mergedOptions, mergedFieldNames);
  }

  // ========================== Context ===========================
  const cascaderContext = React.useMemo(
    () => ({
      classNames,
      styles,
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: checkedValues,
      halfValues: halfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable,
      searchOptions,
      popupPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      popupMenuColumnStyle,
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
      popupPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      popupMenuColumnStyle,
      optionRender,
    ],
  );

  // ==============================================================
  // ==                          Render                          ==
  // ==============================================================
  const emptyOptions = !(mergedSearchValue ? searchOptions : mergedOptions).length;

  const popupStyle: React.CSSProperties =
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
        popupMatchSelectWidth={popupMatchSelectWidth}
        classNames={{
          prefix: classNames?.prefix,
          suffix: classNames?.suffix,
          input: classNames?.input,
        }}
        styles={{
          prefix: styles?.prefix,
          suffix: styles?.suffix,
          input: styles?.input,
        }}
        popupStyle={{
          ...popupStyle,
          ...customPopupStyle,
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
        open={open}
        popupClassName={popupClassName}
        placement={placement}
        onPopupVisibleChange={onInternalPopupVisibleChange}
        // Children
        getRawInputElement={() => children as React.ReactElement}
      />
    </CascaderContext.Provider>
  );
}) as unknown as (<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean | React.ReactNode = false,
>(
  props: React.PropsWithChildren<CascaderProps<OptionType, ValueField, Multiple>> & {
    ref?: React.Ref<CascaderRef>;
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
