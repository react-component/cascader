import * as React from 'react';
import type { BuildInPlacements, TriggerProps } from 'rc-trigger';
import generate from 'rc-tree-select/lib/generate';
import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import type { RefSelectProps } from 'rc-select/lib/generate';
import OptionList from './OptionList';
import type { CascaderValueType, DataNode } from './interface';
import CascaderContext from './context';
import { restoreCompatibleValue } from './util';

const RefCascader = generate({
  prefixCls: 'rc-cascader',
  optionList: OptionList,
});

// ====================================== Wrap ======================================

interface BaseCascaderProps extends Pick<TriggerProps, 'getPopupContainer'> {
  options?: DataNode[];

  changeOnSelect?: boolean;

  // value?: CascaderValueType;
  // defaultValue?: CascaderValueType;

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

  // children?: React.ReactElement;
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
  const { changeOnSelect, options, onChange, ...restProps } = props;
  const { multiple } = restProps;

  const context = React.useMemo(() => ({ changeOnSelect }), [changeOnSelect]);

  // ============================ Ref =============================
  const cascaderRef = React.useRef<RefSelectProps>();

  React.useImperativeHandle(ref, () => ({
    focus: cascaderRef.current.focus,
    blur: cascaderRef.current.blur,
  }));

  const getEntityByValue = (value: React.Key): FlattenDataNode =>
    (cascaderRef.current as any).getEntityByValue(value);

  // =========================== Change ===========================
  const onInternalChange = (value: React.Key | React.Key[]) => {
    if (onChange) {
      const valueList = (multiple ? value : [value]) as React.Key[];

      const pathList: CascaderValueType[] = [];
      const optionsList: DataNode[][] = [];

      const valueEntities = valueList.map(getEntityByValue).filter((entity) => entity);

      valueEntities.forEach((entity) => {
        const { path, options: valueOptions } = restoreCompatibleValue(entity);
        pathList.push(path);
        optionsList.push(valueOptions);
      });

      if (multiple) {
        (onChange as OnMultipleChange)(pathList, optionsList);
      } else {
        (onChange as OnSingleChange)(pathList[0], optionsList[0]);
      }
    }
  };

  // =========================== Render ===========================
  return (
    <CascaderContext.Provider value={context}>
      <RefCascader
        ref={cascaderRef}
        {...restProps}
        dropdownMatchSelectWidth={false}
        treeData={options}
        treeCheckable={multiple}
        onChange={onInternalChange}
        showCheckedStrategy={RefCascader.SHOW_PARENT}
      />
    </CascaderContext.Provider>
  );
});

Cascader.displayName = 'Cascader';

export default Cascader;
