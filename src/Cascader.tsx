import * as React from 'react';
import warning from 'rc-util/lib/warning';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { TreeSelectProps } from 'rc-tree-select';
import generate from 'rc-tree-select/lib/generate';
import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import type { RefSelectProps, Placement } from 'rc-select/lib/generate';
import OptionList from './OptionList';
import type { CascaderValueType, DataNode, FieldNames, ShowSearchType } from './interface';
import CascaderContext from './context';
import {
  connectValue,
  convertOptions,
  fillFieldNames,
  restoreCompatibleValue,
  splitValue,
} from './util';
import useUpdateEffect from './hooks/useUpdateEffect';
import useSearchConfig from './hooks/useSearchConfig';

const INTERNAL_VALUE_FIELD = '__rc_cascader_value__';

/**
 * `rc-cascader` is much like `rc-tree-select` but API is very different.
 * It's caused that component developer is not same person
 * and we do not rice the API naming standard at that time.
 *
 * To avoid breaking change, wrap the `rc-tree-select` to compatible with `rc-cascader` API.
 * This should be better to merge to same API like `rc-tree-select` or `rc-select` in next major version.
 *
 * Update:
 * - dropdown class change to `rc-cascader-dropdown`
 * - direction rtl keyboard
 *
 * Deprecated:
 * - popupVisible
 * - hidePopupOnSelect
 *
 * Removed:
 * - builtinPlacements: Handle by select
 */

const RefCascader = generate({
  prefixCls: 'rc-cascader',
  optionList: OptionList,
});

function defaultDisplayRender(labels: React.ReactNode[]) {
  return labels.join(' / ');
}

// ====================================== Wrap ======================================
interface BaseCascaderProps
  extends Omit<
    TreeSelectProps,
    | 'value'
    | 'defaultValue'
    | 'filterTreeNode'
    | 'labelInValue'
    | 'loadData'
    | 'multiple'
    | 'showCheckedStrategy'
    | 'showSearch'
    | 'treeCheckable'
    | 'treeCheckStrictly'
    | 'treeDataSimpleMode'
    | 'treeNodeFilterProp'
    | 'treeNodeLabelProp'
    | 'treeDefaultExpandAll'
    | 'treeDefaultExpandedKeys'
    | 'treeExpandedKeys'
    | 'treeIcon'
    | 'onChange'
  > {
  options?: DataNode[];
  children?: React.ReactElement;

  // Value
  value?: CascaderValueType | CascaderValueType[];
  defaultValue?: CascaderValueType | CascaderValueType[];
  changeOnSelect?: boolean;
  allowClear?: boolean;
  disabled?: boolean;

  fieldNames?: FieldNames;

  // Display
  displayRender?: (label: React.ReactNode[], selectedOptions: DataNode[]) => React.ReactNode;

  // Search
  showSearch?: boolean | ShowSearchType;
  searchValue?: string;
  onSearch?: (search: string) => void;

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

  // Trigger
  expandTrigger?: 'hover' | 'click';
  autoAdjustOverflow?: boolean;

  dropdownMenuColumnStyle?: React.CSSProperties;
  /** @private Internal usage. Do not use in your production. */
  dropdownPrefixCls?: string;
  loadData?: (selectOptions: DataNode[]) => void;

  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

type OnSingleChange = (value: CascaderValueType, selectOptions: DataNode[]) => void;
type OnMultipleChange = (value: CascaderValueType[], selectOptions: DataNode[][]) => void;

export interface SingleCascaderProps extends BaseCascaderProps {
  checkable?: false;

  onChange?: OnSingleChange;
}

export interface MultipleCascaderProps extends BaseCascaderProps {
  checkable: true | React.ReactNode;

  onChange?: OnMultipleChange;
}

export type CascaderProps = SingleCascaderProps | MultipleCascaderProps;

interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

const Cascader = React.forwardRef((props: CascaderProps, ref: React.Ref<CascaderRef>) => {
  const {
    checkable,

    changeOnSelect,
    children,
    options,
    onChange,
    value,
    defaultValue,

    popupVisible,
    open,
    dropdownClassName,
    popupClassName,
    onDropdownVisibleChange,
    onPopupVisibleChange,
    popupPlacement,
    placement,
    autoAdjustOverflow = true,

    searchValue,
    onSearch,
    showSearch,

    expandTrigger,
    expandIcon = '>',
    loadingIcon,

    displayRender = defaultDisplayRender,

    loadData,
    dropdownMenuColumnStyle,
    dropdownPrefixCls,

    ...restProps
  } = props;

  const { fieldNames } = restProps;

  // ============================ Ref =============================
  const cascaderRef = React.useRef<RefSelectProps>();

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      cascaderRef.current.focus();
    },
    blur: () => {
      cascaderRef.current.blur();
    },
  }));

  const getEntityByValue = (val: React.Key): FlattenDataNode =>
    (cascaderRef.current as any).getEntityByValue(val);

  // =========================== Search ===========================
  const [mergedSearch, setMergedSearch] = useMergedState(undefined, {
    value: searchValue,
    onChange: onSearch,
  });

  const [mergedShowSearch, searchConfig] = useSearchConfig(showSearch);

  // ========================== Options ===========================
  const outerFieldNames = React.useMemo(() => fillFieldNames(fieldNames), [fieldNames]);
  const mergedFieldNames = React.useMemo(
    () => ({
      ...outerFieldNames,
      value: INTERNAL_VALUE_FIELD,
    }),
    [outerFieldNames],
  );

  const mergedOptions = React.useMemo(() => {
    return convertOptions(options, outerFieldNames, INTERNAL_VALUE_FIELD);
  }, [options, outerFieldNames]);

  // =========================== Value ============================
  /**
   * Always pass props value to last value unit:
   * - single: ['light', 'little'] => ['light__little']
   * - multiple: [['light', 'little'], ['bamboo']] => ['light__little', 'bamboo']
   */
  const parseToInternalValue = (
    propValue?: CascaderValueType | CascaderValueType[],
  ): React.Key[] => {
    let propValueList: CascaderValueType[] = [];
    if (propValue) {
      propValueList = (checkable ? propValue : [propValue]) as CascaderValueType[];
    }

    return propValueList.map(connectValue);
  };

  const [internalValue, setInternalValue] = React.useState(() =>
    parseToInternalValue(value || defaultValue),
  );

  useUpdateEffect(() => {
    setInternalValue(parseToInternalValue(value));
  }, [value]);

  // =========================== Label ============================
  const labelRender = (entity: FlattenDataNode, val: string) => {
    const { label: fieldLabel } = mergedFieldNames;

    if (!entity) {
      const valPath = splitValue(val);
      return displayRender(valPath, []);
    }

    if (checkable) {
      return entity.data.node[fieldLabel];
    }

    const { options: selectedOptions } = restoreCompatibleValue(entity, mergedFieldNames);
    const rawOptions = selectedOptions.map(opt => opt.node);
    const labelList = rawOptions.map(opt => opt[fieldLabel]);

    return displayRender(labelList, rawOptions);
  };

  // =========================== Change ===========================
  const onInternalChange = (newValue: any /** Not care current type */) => {
    // TODO: Need improve motion experience
    setMergedSearch('');

    const valueList = (checkable ? newValue : [newValue]) as React.Key[];

    const pathList: CascaderValueType[] = [];
    const optionsList: DataNode[][] = [];

    const valueEntities = valueList.map(getEntityByValue).filter(entity => entity);

    valueEntities.forEach(entity => {
      const { options: valueOptions } = restoreCompatibleValue(entity, mergedFieldNames);
      const originOptions = valueOptions.map(option => option.node);

      pathList.push(
        originOptions.map(
          opt =>
            // Here we should use original FieldNames value mapping
            opt[outerFieldNames.value],
        ),
      );
      optionsList.push(originOptions);
    });

    // Fill state
    if (value === undefined) {
      setInternalValue(valueList);
    }

    if (onChange) {
      if (checkable) {
        (onChange as OnMultipleChange)(pathList, optionsList);
      } else {
        // TODO: This should return null as other component.
        // But its a breaking change and we should keep the logic.
        (onChange as OnSingleChange)(pathList[0] || [], optionsList[0] || []);
      }
    }
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
  const context = React.useMemo(
    () => ({
      changeOnSelect,
      expandTrigger,
      fieldNames: mergedFieldNames,
      expandIcon,
      loadingIcon,
      loadData,
      dropdownMenuColumnStyle,
      search: searchConfig,
      dropdownPrefixCls,
    }),
    [
      changeOnSelect,
      expandTrigger,
      mergedFieldNames,
      expandIcon,
      loadingIcon,
      loadData,
      dropdownMenuColumnStyle,
      searchConfig,
      dropdownPrefixCls,
    ],
  );

  // =========================== Render ===========================
  const dropdownStyle: React.CSSProperties =
    // Search to match width
    (mergedSearch && searchConfig.matchInputWidth) ||
    // Empty keep the width
    !mergedOptions.length
      ? {}
      : {
          minWidth: 'auto',
        };

  return (
    <CascaderContext.Provider value={context}>
      <RefCascader
        ref={cascaderRef}
        {...restProps}
        fieldNames={mergedFieldNames}
        value={checkable ? internalValue : internalValue[0]}
        placement={mergedPlacement}
        dropdownMatchSelectWidth={false}
        autoAdjustOverflow={autoAdjustOverflow}
        dropdownStyle={dropdownStyle}
        dropdownClassName={mergedDropdownClassName}
        treeData={mergedOptions}
        treeCheckable={checkable}
        treeNodeFilterProp="label"
        onChange={onInternalChange}
        showCheckedStrategy={RefCascader.SHOW_PARENT}
        open={mergedOpen}
        onDropdownVisibleChange={onInternalDropdownVisibleChange}
        searchValue={mergedSearch}
        // Customize filter logic in OptionList
        filterTreeNode={() => true}
        showSearch={mergedShowSearch}
        onSearch={setMergedSearch}
        labelRender={labelRender}
        getRawInputElement={() => children}
      />
    </CascaderContext.Provider>
  );
});

Cascader.displayName = 'Cascader';

export default Cascader;
