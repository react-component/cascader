import React from 'react';
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
    };

    if (showSearch && typeof showSearch === 'object') {
      searchConfig = {
        ...searchConfig,
        ...showSearch,
      };
    }

    return [true, searchConfig];
  }, [showSearch]);
}
