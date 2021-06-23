import * as React from 'react';
import type { CascaderProps } from './Cascader';

const CascaderContext = React.createContext<
  Pick<CascaderProps, 'changeOnSelect' | 'expandTrigger'>
>({
  changeOnSelect: false,
  expandTrigger: 'click',
});

export default CascaderContext;
