import * as React from 'react';
import type { CascaderProps } from './Cascader';

const CascaderContext = React.createContext<
  Required<Pick<CascaderProps, 'changeOnSelect' | 'expandTrigger' | 'fieldNames'>>
>({
  changeOnSelect: false,
  expandTrigger: 'click',
  fieldNames: null,
});

export default CascaderContext;
