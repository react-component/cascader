import * as React from 'react';
import type { CascaderProps } from './Cascader';
import type { ShowSearchType } from './interface';

const CascaderContext = React.createContext<
  Required<
    Pick<
      CascaderProps,
      | 'changeOnSelect'
      | 'expandTrigger'
      | 'fieldNames'
      | 'expandIcon'
      | 'loadingIcon'
      | 'loadData'
      | 'dropdownMenuColumnStyle'
    > & {
      search: ShowSearchType;
    }
  >
>({
  changeOnSelect: false,
  expandTrigger: 'click',
  fieldNames: null,
  expandIcon: null,
  loadingIcon: null,
  loadData: null,
  dropdownMenuColumnStyle: null,
  search: null,
});

export default CascaderContext;
