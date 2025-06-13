import warning from '@rc-component/util/lib/warning';
import * as React from 'react';
import type { CascaderProps, SearchConfig } from '../Cascader';

// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch?: CascaderProps['showSearch'], props?: any) {
  const { autoClearSearchValue, searchValue, onSearch } = props;
  return React.useMemo<[boolean, SearchConfig]>(() => {
    if (!showSearch) {
      return [false, {}];
    }

    let searchConfig: SearchConfig = {
      matchInputWidth: true,
      limit: 50,
      autoClearSearchValue,
      searchValue,
      onSearch,
    };

    if (showSearch && typeof showSearch === 'object') {
      searchConfig = {
        ...searchConfig,
        ...showSearch,
      };
    }

    if ((searchConfig.limit as number) <= 0) {
      searchConfig.limit = false;

      if (process.env.NODE_ENV !== 'production') {
        warning(false, "'limit' of showSearch should be positive number or false.");
      }
    }

    return [true, searchConfig];
  }, [showSearch, autoClearSearchValue, searchValue, onSearch]);
}
