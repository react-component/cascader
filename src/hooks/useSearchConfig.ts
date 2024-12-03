import warning from 'rc-util/lib/warning';
import * as React from 'react';
import type { CascaderProps, ShowSearchType } from '../Cascader';

// Convert `showSearch` to unique config
export default function useSearchConfig(showSearch?: CascaderProps['showSearch']) {
  return React.useMemo<[boolean, ShowSearchType]>(() => {
    if (!showSearch) {
      return [false, {}];
    }

    let searchConfig: ShowSearchType = {
      matchInputWidth: true,
      limit: 50,
      displayInInput: true,
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

    return [!!searchConfig.displayInInput, searchConfig];
  }, [showSearch]);
}
