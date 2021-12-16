import * as React from 'react';
import type {
  CascaderProps,
  InternalFieldNames,
  DefaultOptionType,
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
  searchOptions: DefaultOptionType[];
}

const CascaderContext = React.createContext<CascaderContextProps>(null);

export default CascaderContext;
