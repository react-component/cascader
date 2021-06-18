import * as React from 'react';
import generateSelector from 'rc-select/lib/generate';
import type { BuildInPlacements, TriggerProps } from 'rc-trigger';
import OptionList from './OptionList';
import type { CascaderValueType, DataNode } from './interface';
import {
  filterOptions,
  findValueOption,
  flattenOptions,
  getLabeledValue,
  isValueDisabled,
} from './utils';
import CascaderContext from './context';

const RefCascader = generateSelector<DataNode[]>({
  prefixCls: 'rc-cascader',
  components: {
    optionList: OptionList,
  },
  // No need to convert children
  convertChildrenToData: () => null,

  flattenOptions,

  // Handle `optionLabelProp` in TreeSelect component
  getLabeledValue,

  filterOptions,

  findValueOption,

  isValueDisabled,

  // omitDOMProps: (props: object) => {
  //   const cloneProps = { ...props };
  //   OMIT_PROPS.forEach((prop) => {
  //     delete cloneProps[prop];
  //   });
  //   return cloneProps;
  // },
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

interface SingleCascaderProps extends BaseCascaderProps {
  multiple?: false;

  onChange?: (value: CascaderValueType, selectOptions: DataNode[]) => void;
}

interface MultipleCascaderProps extends BaseCascaderProps {
  multiple: true;

  onChange?: (value: CascaderValueType[], selectOptions: DataNode[][]) => void;
}

export type CascaderProps = SingleCascaderProps | MultipleCascaderProps;

export default function Cascader(props: CascaderProps) {
  const { options, onChange, changeOnSelect, multiple } = props;

  // Since onChange need additional info. We duplicate process data here
  const mergedFlattenOptions = React.useMemo(() => flattenOptions(options), [options]);

  const context = React.useMemo(() => ({ changeOnSelect }), [changeOnSelect]);

  return (
    <CascaderContext.Provider value={context}>
      <RefCascader
        {...props}
        mode={multiple ? 'multiple' : null}
        onChange={(newValue) => {
          const valueList = Array.isArray(newValue) ? newValue : [newValue];

          const pathValueList: CascaderValueType[] = [];
          const pathOptionList: DataNode[][] = [];

          valueList.forEach((val) => {
            const option = mergedFlattenOptions.find(({ data }) => data.value === val);
            const pathValue: CascaderValueType = [];
            const pathOption: DataNode[] = [];

            let current = option;
            while (current) {
              pathValue.unshift(current.data.value);
              pathOption.unshift(current.data);

              current = current.parent;
            }

            pathValueList.push(pathValue);
            pathOptionList.push(pathOption);
          });

          console.log('Internal Change:', multiple, pathValueList);

          if (multiple) {
            onChange?.(pathValueList as any, pathOptionList as any);
          } else {
            onChange?.(pathValueList[0] as any, pathOptionList[0] as any);
          }
        }}
      />
    </CascaderContext.Provider>
  );
}
