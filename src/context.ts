import * as React from 'react';
import type {
  CascaderProps,
  InternalFieldNames,
  DefaultOptionType,
  SingleValueType,
} from './Cascader';

export interface CascaderContextProps {
  options: NonNullable<CascaderProps['options']>;
  fieldNames: InternalFieldNames;
  values: SingleValueType[];
  halfValues: SingleValueType[];
  changeOnSelect?: boolean;
  onSelect: (valuePath: SingleValueType) => void;
  checkable?: boolean | React.ReactNode;
  searchOptions: DefaultOptionType[];
  popupPrefixCls?: string;
  loadData?: (selectOptions: DefaultOptionType[]) => void;
  expandTrigger?: 'hover' | 'click';
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  popupMenuColumnStyle?: React.CSSProperties;
  optionRender?: CascaderProps['optionRender'];
  classNames?: CascaderProps['classNames'];
  styles?: CascaderProps['styles'];
}

const CascaderContext = React.createContext<CascaderContextProps>({} as CascaderContextProps);

export default CascaderContext;
