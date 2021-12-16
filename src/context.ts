import * as React from 'react';
import type {
  CascaderProps,
  InternalFieldNames,
  ShowSearchType,
  SingleValueType,
} from './Cascader';

export interface CascaderContextProps {
  options: CascaderProps['options'];
  fieldNames: InternalFieldNames;
  values: SingleValueType[];
  halfValues: SingleValueType[];
  changeOnSelect?: boolean;
  onSelect: (valuePath: SingleValueType, leaf: boolean) => void;
  checkable?: boolean | React.ReactNode;
  searchConfig: ShowSearchType;
}

const CascaderContext = React.createContext<CascaderContextProps>(null);

export default CascaderContext;
