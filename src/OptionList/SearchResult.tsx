/**
 * Search result UI is different with origin menu list.
 * We use single component to handle this.
 */
import * as React from 'react';
import { isLeaf, restoreCompatibleValue } from '../util';
import type { OptionListProps as SelectOptionListProps } from 'rc-select/lib/OptionList';
import type { FieldNames, OptionDataNode, ShowSearchType } from '../interface';
import Column from './Column';
import type { ColumnProps } from './Column';

const defaultFilter: ShowSearchType['filter'] = (search, options, { label }) =>
  options.some(opt => String(opt[label]).toLowerCase().includes(search.toLowerCase()));

const defaultRender: ShowSearchType['render'] = (inputValue, path, prefixCls, fieldNames) =>
  path.map(opt => opt[fieldNames.label]).join(' / ');

export interface SearchResultProps extends Omit<ColumnProps, 'index' | 'options'> {
  prefixCls: string;
  flattenOptions: SelectOptionListProps<OptionDataNode[]>['flattenOptions'];
  fieldNames: FieldNames;
  search: string;
  searchConfig: ShowSearchType;
  changeOnSelect: boolean;
  empty: OptionDataNode[];
}

export default function SearchResult(props: SearchResultProps) {
  const { flattenOptions, fieldNames, search, searchConfig, changeOnSelect, empty, prefixCls } =
    props;

  // ============================== MISC ==============================
  const filterOption = searchConfig.filter || defaultFilter;
  const renderOption = searchConfig.render || defaultRender;

  // ============================= Filter =============================
  // Do filter
  const filteredEntityList = React.useMemo(() => {
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
    const filteredList = normalizeList.filter(({ originOptionList }) => {
      return filterOption(search, originOptionList, fieldNames);
    });

    return filteredList;
  }, [flattenOptions, fieldNames, search, filterOption, changeOnSelect]);

  // ======================== Generate Options ========================
  // Wrap with connected label
  const options = React.useMemo(() => {
    return filteredEntityList.map(({ option, originOptionList }) => {
      const title = renderOption(search, originOptionList, prefixCls, fieldNames);
      return {
        ...option.data,
        title,
      };
    });
  }, [search, renderOption, filteredEntityList, fieldNames, prefixCls]);

  // ============================= Render =============================
  return (
    <Column {...props} index={0} options={options.length ? options : empty} multiple={false} />
  );
}
