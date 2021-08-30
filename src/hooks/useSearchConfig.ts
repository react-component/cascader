import * as React from 'react';
import warning from 'rc-util/lib/warning';
import type { ShowSearchType } from '../interface';
import type { CascaderProps } from '../Cascader';

// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch?: CascaderProps['showSearch']) {
  return React.useMemo<[boolean, ShowSearchType]>(() => {
    if (!showSearch) {
      return [false, {}];
    }

    let searchConfig: ShowSearchType = {
      matchInputWidth: true,
      limit: 50,
    };

    if (showSearch && typeof showSearch === 'object') {
      searchConfig = {
        ...searchConfig,
        ...showSearch,
      };
    }

    if (process.env.NODE_ENV !== 'production' && searchConfig.limit <= 0) {
      warning(false, "'limit' of showSearch should be positive number or false.");
    }

    return [true, searchConfig];
  }, [showSearch]);
}
