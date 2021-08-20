import * as React from 'react';
import type { CascaderProps } from './Cascader';

const CascaderContext = React.createContext<
  Required<Pick<CascaderProps, 'changeOnSelect' | 'expandTrigger' | 'fieldNames' | 'expandIcon'>>
>({
  changeOnSelect: false,
  expandTrigger: 'click',
  fieldNames: null,
  expandIcon: null,
});

export default CascaderContext;
