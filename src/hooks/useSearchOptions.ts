import type { DefaultOptionType, ShowSearchType, InternalFieldNames } from '../Cascader';
import * as React from 'react';

export const SEARCH_MARK = '__rc_cascader_search_mark__';

const defaultFilter: ShowSearchType['filter'] = (search, options, { label }) =>
  options.some(opt => String(opt[label]).toLowerCase().includes(search.toLowerCase()));

const defaultRender: ShowSearchType['render'] = (inputValue, path, prefixCls, fieldNames) =>
  path.map(opt => opt[fieldNames.label]).join(' / ');

export default (
  search: string,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  prefixCls: string,
  config: ShowSearchType,
  changeOnSelect: boolean,
) => {
  const { filter = defaultFilter, render = defaultRender, limit = 50, sort } = config;

  return React.useMemo(() => {
    const filteredOptions: DefaultOptionType[] = [];
    if (!search) {
      return [];
    }

    function dig(list: DefaultOptionType[], pathOptions: DefaultOptionType[]) {
      list.forEach(option => {
        // Perf saving when `sort` is disabled and `limit` is provided
        if (!sort && limit > 0 && filteredOptions.length >= limit) {
          return;
        }

        const connectedPathOptions = [...pathOptions, option];
        const children = option[fieldNames.children];

        // If current option is filterable
        if (
          // If is leaf option
          !children ||
          children.length === 0 ||
          // If is changeOnSelect
          changeOnSelect
        ) {
          if (filter(search, connectedPathOptions, { label: fieldNames.label })) {
            filteredOptions.push({
              ...option,
              [fieldNames.label as 'label']: render(
                search,
                connectedPathOptions,
                prefixCls,
                fieldNames,
              ),
              [SEARCH_MARK]: connectedPathOptions,
            });
          }
        }

        if (children) {
          dig(option[fieldNames.children] as DefaultOptionType[], connectedPathOptions);
        }
      });
    }

    dig(options, []);

    // Do sort
    if (sort) {
      filteredOptions.sort((a, b) => {
        return sort(a[SEARCH_MARK], b[SEARCH_MARK], search, fieldNames);
      });
    }

    return limit > 0 ? filteredOptions.slice(0, limit as number) : filteredOptions;
  }, [search, options, fieldNames, prefixCls, render, changeOnSelect, filter, sort, limit]);
};
