/**
 * Search result UI is different with origin menu list.
 * We use single component to handle this.
 */
import { isLeaf } from '../util';
import * as React from 'react';
import type { OptionDataNode } from '../interface';
import Column from './Column';
import type { ColumnProps } from './Column';

export type SearchResultProps = Omit<ColumnProps, 'index'>;

function flattenOptions(options: OptionDataNode[]): OptionDataNode[] {
  const optionList: OptionDataNode[] = [];

  function dig(list: OptionDataNode[], labelPath: React.ReactNode[] = []) {
    (list || []).forEach(option => {
      const connectLabelPath = [...labelPath, option.title];

      if (isLeaf(option)) {
        optionList.push({
          title: connectLabelPath.reduce((labelList: React.ReactNode[], currentLabel, index) => {
            if (index !== 0) {
              labelList.push(' / ');
            }
            labelList.push(currentLabel);
            return list;
          }, []),
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
