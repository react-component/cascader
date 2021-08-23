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

export interface SearchResultProps extends Omit<ColumnProps, 'index' | 'options'> {
  flattenOptions: SelectOptionListProps<OptionDataNode[]>['flattenOptions'];
  fieldNames: FieldNames;
  search: string;
  searchConfig: ShowSearchType;
  changeOnSelect: boolean;
  empty: OptionDataNode[];
}

export default function SearchResult(props: SearchResultProps) {
  const { flattenOptions, fieldNames, search, searchConfig, changeOnSelect, empty } = props;

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
      normalizeList = normalizeList.filter(({ option }) => !option.data.children?.length);
    }

    // Filter
    const filteredList = normalizeList.filter(({ originOptionList }) => {
      return searchConfig.filter(search, originOptionList, fieldNames);
    });

    return filteredList;
  }, [flattenOptions, fieldNames, search, searchConfig, changeOnSelect]);

  // Wrap with connected label
  const options = React.useMemo(() => {
    return filteredEntityList.map(({ option, originOptionList }) => {
      const title = originOptionList.map(opt => opt[fieldNames.label]).join(' / ');
      return {
        ...option.data,
        title,
      };
    });
  }, [filteredEntityList, fieldNames]);

  return (
    <Column {...props} index={0} options={options.length ? options : empty} multiple={false} />
  );
}
