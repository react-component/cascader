import * as React from 'react';
import type { BuildInPlacements, TriggerProps } from 'rc-trigger';
import generate from 'rc-tree-select/lib/generate';
import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import type { RefSelectProps } from 'rc-select/lib/generate';
import OptionList from './OptionList';
import type { CascaderValueType, DataNode } from './interface';
import CascaderContext from './context';
import { restoreCompatibleValue } from './util';
import useUpdateEffect from './hooks/useUpdateEffect';

const RefCascader = generate({
  prefixCls: 'rc-cascader',
  optionList: OptionList,
});

// ====================================== Wrap ======================================

interface BaseCascaderProps extends Pick<TriggerProps, 'getPopupContainer'> {
  options?: DataNode[];
  children?: React.ReactElement;

  // Value
  value?: CascaderValueType | CascaderValueType[];
  defaultValue?: CascaderValueType | CascaderValueType[];

  changeOnSelect?: boolean;

  allowClear?: boolean;

  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  // popupVisible?: boolean;
  // disabled?: boolean;
  // transitionName?: string;
  // popupClassName?: string;
  // popupPlacement?: string;
  // prefixCls?: string;
  // dropdownMenuColumnStyle?: React.CSSProperties;
  // dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  // builtinPlacements?: BuildInPlacements;
  // loadData?: (selectOptions: DataNode[]) => void;

  // onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  // expandTrigger?: string;
  // // fieldNames?: CascaderFieldNames;
  // // filedNames?: CascaderFieldNames; // typo but for compatibility
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
  const { changeOnSelect, children, options, onChange, value, defaultValue, ...restProps } = props;
  const { multiple } = restProps;

  const context = React.useMemo(() => ({ changeOnSelect }), [changeOnSelect]);

  // ============================ Ref =============================
  const cascaderRef = React.useRef<RefSelectProps>();

  React.useImperativeHandle(ref, () => ({
    focus: cascaderRef.current.focus,
    blur: cascaderRef.current.blur,
  }));

  const getEntityByValue = (val: React.Key): FlattenDataNode =>
    (cascaderRef.current as any).getEntityByValue(val);

  // =========================== Value ============================
  /**
   * Always pass props value to last value unit:
   * - single: ['light', 'little'] => ['little']
   * - multiple: [['light', 'little'], ['bamboo']] => ['little', 'bamboo']
   */
  const parseToInternalValue = (
    propValue?: CascaderValueType | CascaderValueType[],
  ): React.Key[] => {
    let propValueList: CascaderValueType[] = [];
    if (propValue) {
      propValueList = (multiple ? propValue : [propValue]) as CascaderValueType[];
    }

    return propValueList.map((pathValue) => pathValue[pathValue.length - 1]);
  };

  const [internalValue, setInternalValue] = React.useState(() =>
    parseToInternalValue(value || defaultValue),
  );

  useUpdateEffect(() => {
    setInternalValue(parseToInternalValue(value));
  }, [value]);

  // =========================== Label ============================
  const labelRender = (entity: FlattenDataNode) => {
    if (multiple) {
      return entity.data.label;
    }

    const pathLabel: React.ReactNode[] = [];
    let current = entity;
    while (current) {
      pathLabel.unshift(current.data.label);
      current = current.parent;
    }

    return pathLabel.join('>');
  };

  // =========================== Change ===========================
  const onInternalChange = (newValue: any /** Not care current type */) => {
    if (onChange) {
      const valueList = (multiple ? newValue : [newValue]) as React.Key[];

      const pathList: CascaderValueType[] = [];
      const optionsList: DataNode[][] = [];

      const valueEntities = valueList.map(getEntityByValue).filter((entity) => entity);

      valueEntities.forEach((entity) => {
        const { path, options: valueOptions } = restoreCompatibleValue(entity);
        pathList.push(path);
        optionsList.push(valueOptions);
      });

      // Fill state
      if (value === undefined) {
        setInternalValue(valueList);
      }

      console.log('~~~>');

      if (multiple) {
        (onChange as OnMultipleChange)(pathList, optionsList);
      } else {
        // TODO: This should return null as other component.
        // But its a breaking change and we should keep the logic.
        (onChange as OnSingleChange)(pathList[0] || [], optionsList[0] || []);
      }
    }
  };

  // =========================== Render ===========================
  return (
    <CascaderContext.Provider value={context}>
      <RefCascader
        ref={cascaderRef}
        {...restProps}
        value={multiple ? internalValue : internalValue[0]}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{
          minWidth: 'auto',
        }}
        treeData={options}
        treeCheckable={multiple}
        onChange={onInternalChange}
        showCheckedStrategy={RefCascader.SHOW_PARENT}
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
