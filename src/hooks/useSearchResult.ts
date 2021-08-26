import * as React from 'react';
import type { FlattenOptions } from '../OptionList';
import type { FieldNames, ShowSearchType } from '../interface';
import { isLeaf, restoreCompatibleValue } from '../util';

const defaultFilter: ShowSearchType['filter'] = (search, options, { label }) =>
  options.some(opt => String(opt[label]).toLowerCase().includes(search.toLowerCase()));

const defaultRender: ShowSearchType['render'] = (inputValue, path, prefixCls, fieldNames) =>
  path.map(opt => opt[fieldNames.label]).join(' / ');

export interface SearchResultConfig {
  prefixCls: string;
  searchConfig: ShowSearchType;
  flattenOptions: FlattenOptions;
  fieldNames: FieldNames;
  changeOnSelect: boolean;
  searchValue: string;
}

export default function useSearchResult(resultConfig: SearchResultConfig) {
  const { searchConfig, flattenOptions, fieldNames, changeOnSelect, searchValue, prefixCls } =
    resultConfig;

  // ============================== MISC ==============================
  const filterOption = searchConfig.filter || defaultFilter;
  const renderOption = searchConfig.render || defaultRender;

  // ============================= Filter =============================
  // Do filter
  const filteredEntityList = React.useMemo(() => {
    if (!searchValue) {
      return [];
    }

    // Normalize list
    let normalizeList = flattenOptions.map(option => {
      const { options } = restoreCompatibleValue(option as any, fieldNames);
      const originOptionList = options.map(opt => opt.node);
      return {
        option,
        originOptionList,
      };
    });

    // Not keep parent node when !changeOnSelect
    if (!changeOnSelect) {
      normalizeList = normalizeList.filter(({ option }) => isLeaf(option.data));
    }

    // Filter
    const filteredList: typeof normalizeList = [];
    for (let i = 0; i < normalizeList.length; i += 1) {
      // Perf saving if enabled
      if (!searchConfig.sort && filteredList.length >= searchConfig.limit) {
        break;
      }

      // Do filter
      const optGrp = normalizeList[i];
      if (filterOption(searchValue, optGrp.originOptionList, fieldNames)) {
        filteredList.push(optGrp);
      }
    }

    // Sort: When searchConfig.sort is enabled. We have to filter all the list
    if (searchConfig.sort) {
      filteredList.sort((a, b) => {
        return searchConfig.sort(a.originOptionList, b.originOptionList, searchValue, fieldNames);
      });
    }

    return filteredList;
  }, [flattenOptions, fieldNames, searchValue, filterOption, changeOnSelect, searchConfig]);

  // ======================== Generate Options ========================
  // Wrap with connected label
  const options = React.useMemo(() => {
    return filteredEntityList.map(({ option, originOptionList }) => {
      const title = renderOption(searchValue, originOptionList, prefixCls, fieldNames);
      return {
        ...option.data,
        title,
      };
    });
  }, [searchValue, renderOption, filteredEntityList, fieldNames, prefixCls]);

  return options;
}
