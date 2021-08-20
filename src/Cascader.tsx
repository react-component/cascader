import * as React from 'react';
import type { TriggerProps } from 'rc-trigger';
import warning from 'rc-util/lib/warning';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import generate from 'rc-tree-select/lib/generate';
import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import { fillFieldNames } from 'rc-tree-select/lib/utils/valueUtil';
import type { RefSelectProps } from 'rc-select/lib/generate';
import OptionList from './OptionList';
import type { CascaderValueType, DataNode, FieldNames } from './interface';
import CascaderContext from './context';
import { connectValue, convertOptions, restoreCompatibleValue } from './util';
import useUpdateEffect from './hooks/useUpdateEffect';

/**
 * `rc-cascader` is much like `rc-tree-select` but API is very different.
 * It's caused that component developer is not same person
 * and we do not rice the API naming standard at that time.
 *
 * To avoid breaking change, wrap the `rc-tree-select` to compatible with `rc-cascader` API.
 * This should be better to merge to same API like `rc-tree-select` or `rc-select` in next major version.
 *
 * Deprecated:
 * - popupVisible
 * - onPopupVisibleChange
 * - filedNames
 */

const RefCascader = generate({
  prefixCls: 'rc-cascader',
  optionList: OptionList,
});

// ====================================== Wrap ======================================
export interface ShowSearchType {
  filter?: (inputValue: string, path: CascaderValueType, names: FieldNames) => boolean;
  render?: (
    inputValue: string,
    path: CascaderValueType,
    prefixCls: string | undefined,
    names: FieldNames,
  ) => React.ReactNode;
  sort?: (
    a: CascaderValueType,
    b: CascaderValueType,
    inputValue: string,
    names: FieldNames,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

interface BaseCascaderProps
  extends Pick<TriggerProps, 'getPopupContainer'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> {
  options?: DataNode[];
  children?: React.ReactElement;

  // Value
  value?: CascaderValueType | CascaderValueType[];
  defaultValue?: CascaderValueType | CascaderValueType[];
  changeOnSelect?: boolean;
  allowClear?: boolean;
  disabled?: boolean;

  /** @deprecated Typo. Please use `fieldNames` instead. */
  filedNames?: FieldNames;
  fieldNames?: FieldNames;

  // Search
  showSearch?: boolean | ShowSearchType;
  searchValue?: string;
  onSearch?: (search: string) => void;

  // Open
  /** @deprecated Use `open` instead */
  popupVisible?: boolean;
  open?: boolean;

  /** @deprecated Use `onDropdownVisibleChange` instead */
  onPopupVisibleChange?: (open: boolean) => void;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Trigger
  expandTrigger?: 'hover' | 'click';

  // transitionName?: string;
  // popupClassName?: string;
  // popupPlacement?: string;
  // prefixCls?: string;
  // dropdownMenuColumnStyle?: React.CSSProperties;
  // dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  // builtinPlacements?: BuildInPlacements;
  // loadData?: (selectOptions: DataNode[]) => void;

  // expandIcon?: React.ReactNode;
  // loadingIcon?: React.ReactNode;
}

type OnSingleChange = (value: CascaderValueType, selectOptions: DataNode[]) => void;
type OnMultipleChange = (value: CascaderValueType[], selectOptions: DataNode[][]) => void;

interface SingleCascaderProps extends BaseCascaderProps {
  multiple?: false;

  onChange?: OnSingleChange;
}

interface MultipleCascaderProps extends BaseCascaderProps {
  multiple: true;

  onChange?: OnMultipleChange;
}

export type CascaderProps = SingleCascaderProps | MultipleCascaderProps;

interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

const Cascader = React.forwardRef((props: CascaderProps, ref: React.Ref<CascaderRef>) => {
  const {
    changeOnSelect,
    children,
    options,
    onChange,
    value,
    defaultValue,

    popupVisible,
    open,
    onDropdownVisibleChange,
    onPopupVisibleChange,

    searchValue,
    onSearch,

    expandTrigger,

    ...restProps
  } = props;

  const { multiple, fieldNames } = restProps;

  const mergedFieldNames = React.useMemo(() => fillFieldNames(fieldNames), [fieldNames]);

  const context = React.useMemo(
    () => ({ changeOnSelect, expandTrigger, fieldNames: mergedFieldNames }),
    [changeOnSelect, expandTrigger, mergedFieldNames],
  );

  // ============================ Ref =============================
  const cascaderRef = React.useRef<RefSelectProps>();

  React.useImperativeHandle(ref, () => ({
    focus: cascaderRef.current.focus,
    blur: cascaderRef.current.blur,
  }));

  const getEntityByValue = (val: React.Key): FlattenDataNode =>
    (cascaderRef.current as any).getEntityByValue(val);

  // =========================== Search ===========================
  const [mergedSearch, setMergedSearch] = useMergedState(undefined, {
    value: searchValue,
    onChange: onSearch,
  });

  // ========================== Options ===========================
  const mergedOptions = React.useMemo(() => {
    return convertOptions(options, mergedFieldNames);
  }, [options, mergedFieldNames]);

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
      propValueList = (multiple ? propValue : [propValue]) as CascaderValueType[];
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
  const labelRender = (entity: FlattenDataNode) => {
    const { label: fieldLabel } = mergedFieldNames;

    if (multiple) {
      return entity.data.node[fieldLabel];
    }

    return restoreCompatibleValue(entity, mergedFieldNames)
      .options.map(opt => opt[fieldLabel])
      .join('>');
  };

  // =========================== Change ===========================
  const onInternalChange = (newValue: any /** Not care current type */) => {
    // TODO: Need improve motion experience
    setMergedSearch('');

    const valueList = (multiple ? newValue : [newValue]) as React.Key[];

    const pathList: CascaderValueType[] = [];
    const optionsList: DataNode[][] = [];

    const valueEntities = valueList.map(getEntityByValue).filter(entity => entity);

    valueEntities.forEach(entity => {
      const { options: valueOptions } = restoreCompatibleValue(entity, mergedFieldNames);
      const originOptions = valueOptions.map(option => option.node);

      pathList.push(originOptions.map(opt => opt[mergedFieldNames.value]));
      optionsList.push(originOptions);
    });

    // Fill state
    if (value === undefined) {
      setInternalValue(valueList);
    }

    if (onChange) {
      if (multiple) {
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
  }

  const mergedOpen = open !== undefined ? open : popupVisible;

  const onInternalDropdownVisibleChange = (nextVisible: boolean) => {
    onDropdownVisibleChange?.(nextVisible);
    onPopupVisibleChange?.(nextVisible);
  };

  // =========================== Render ===========================
  const dropdownStyle: React.CSSProperties =
    mergedSearch || !mergedOptions.length
      ? {}
      : {
          minWidth: 'auto',
        };

  return (
    <CascaderContext.Provider value={context}>
      <RefCascader
        ref={cascaderRef}
        {...restProps}
        value={multiple ? internalValue : internalValue[0]}
        dropdownMatchSelectWidth={false}
        dropdownStyle={dropdownStyle}
        treeData={mergedOptions}
        treeCheckable={multiple}
        treeNodeFilterProp="label"
        onChange={onInternalChange}
        showCheckedStrategy={RefCascader.SHOW_PARENT}
        open={mergedOpen}
        onDropdownVisibleChange={onInternalDropdownVisibleChange}
        searchValue={mergedSearch}
        onSearch={setMergedSearch}
        labelRender={labelRender}
        {...{
          getRawInputElement: () => children,
        }}
      />
    </CascaderContext.Provider>
  );
});

Cascader.displayName = 'Cascader';

export default Cascader;
