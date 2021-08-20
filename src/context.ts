import * as React from 'react';
import type { CascaderProps } from './Cascader';

const CascaderContext = React.createContext<
  Required<
    Pick<
      CascaderProps,
      'changeOnSelect' | 'expandTrigger' | 'fieldNames' | 'expandIcon' | 'loadingIcon' | 'loadData'
    >
  >
>({
  changeOnSelect: false,
  expandTrigger: 'click',
  fieldNames: null,
  expandIcon: null,
  loadingIcon: null,
  loadData: null,
});

export default CascaderContext;
