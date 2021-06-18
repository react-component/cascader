import * as React from 'react';
import type { DataNode } from '../interface';

export interface ColumnProps {
  prefixCls: string;
  index: number;
  options: DataNode[];
  onClick: (index: number, value: React.Key, isLeaf: boolean) => void;
}

export default function Column({ prefixCls, index, options, onClick }: ColumnProps) {
  return (
    <ul className={`${prefixCls}-column`} role="menu">
      {options.map((option) => (
        <li
          key={option.value}
          role="menuitemcheckbox"
          onClick={() => {
            const { isLeaf, children } = option;
            const isMergedLeaf = isLeaf !== undefined ? isLeaf : !children?.length;

            onClick(index, option.value, isMergedLeaf);
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
