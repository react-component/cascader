/**
 * Search result UI is different with origin menu list.
 * We use single component to handle this.
 */
import { isLeaf } from '../util';
import * as React from 'react';
import type { DataNode } from '../interface';
import Column from './Column';
import type { ColumnProps } from './Column';

export type SearchResultProps = Omit<ColumnProps, 'index'>;

function flattenOptions(options: DataNode[]): DataNode[] {
  const optionList: DataNode[] = [];

  function dig(list: DataNode[], labelPath: React.ReactNode[] = []) {
    (list || []).forEach(option => {
      const connectLabelPath = [...labelPath, option.label];

      if (isLeaf(option)) {
        optionList.push({
          label: connectLabelPath.join(' / '),
          value: option.value,
        });
      } else {
        dig(option.children, connectLabelPath);
      }
    });
  }

  dig(options);

  return optionList;
}

export default function SearchResult(props: SearchResultProps) {
  const { options } = props;

  const optionList = React.useMemo(() => flattenOptions(options), [options]);

  return <Column {...props} index={0} options={optionList} multiple={false} />;
}
