import * as React from 'react';
import type { BuildInPlacements, TriggerProps } from 'rc-trigger';
import RcCascader from '../../src';
import type { CascaderValueType, DataNode } from '../../src/interface';
import { flattenOptions } from '../../src/utils';

export interface CascaderProps extends Pick<TriggerProps, 'getPopupContainer'> {
  value?: CascaderValueType;
  defaultValue?: CascaderValueType;
  options?: DataNode[];
  onChange?: (value: CascaderValueType, selectOptions: DataNode[]) => void;
  onPopupVisibleChange?: (popupVisible: boolean) => void;
  popupVisible?: boolean;
  disabled?: boolean;
  transitionName?: string;
  popupClassName?: string;
  popupPlacement?: string;
  prefixCls?: string;
  dropdownMenuColumnStyle?: React.CSSProperties;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  builtinPlacements?: BuildInPlacements;
  loadData?: (selectOptions: DataNode[]) => void;
  changeOnSelect?: boolean;
  children?: React.ReactElement;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  expandTrigger?: string;
  // fieldNames?: CascaderFieldNames;
  // filedNames?: CascaderFieldNames; // typo but for compatibility
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

export default function Cascader(props: CascaderProps) {
  const { options, onChange } = props;

  const mergedFlattenOptions = React.useMemo(() => flattenOptions(options), [options]);

  return (
    <RcCascader
      {...props}
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

        console.log('内因变化：', pathValueList[0], pathOptionList[0]);
      }}
    />
  );
}
