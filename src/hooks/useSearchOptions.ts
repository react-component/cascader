import type { DefaultOptionType, ShowSearchType, InternalFieldNames } from '../Cascader';
import * as React from 'react';

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
  const { filter = defaultFilter, render = defaultRender, limit = 50 } = config;

  return React.useMemo(() => {
    const filteredOptions: DefaultOptionType[] = [];
    if (!search) {
      return [];
    }

    function dig(list: DefaultOptionType[], pathOptions: DefaultOptionType[]) {
      list.forEach(option => {
        const connectedPathOptions = [...pathOptions, option];
        const children = option[fieldNames.children];

        // If current option is filterable
        if (
          // If is leaf option
          !children ||
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
            });
          }
        }

        if (children) {
          dig(option[fieldNames.children] as DefaultOptionType[], connectedPathOptions);
        }
      });
    }

    dig(options, []);

    return filteredOptions;
  }, [search, options, fieldNames, prefixCls, render, changeOnSelect, filter]);
};
