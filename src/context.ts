import * as React from 'react';
import type { CascaderProps, FieldNames, SingleValueType } from './Cascader';

export interface CascaderContextProps {
  options: CascaderProps['options'];
  fieldNames: FieldNames;
  values: SingleValueType[];
  changeOnSelect?: boolean;
  onSelect: (valuePath: SingleValueType, leaf: boolean) => void;
}

const CascaderContext = React.createContext<CascaderContextProps>(null);

export default CascaderContext;
