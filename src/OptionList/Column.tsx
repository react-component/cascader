import * as React from 'react';
import type { DataNode } from '../interface';

export interface ColumnProps {
  prefixCls: string;
  index: number;
  options: DataNode[];
  onClick: (index: number, value: React.Key) => void;
}

export default function Column({ prefixCls, index, options, onClick }: ColumnProps) {
  return (
    <ul className={`${prefixCls}-column`} role="menu">
      {options.map((option) => (
        <li
          key={option.value}
          role="menuitemcheckbox"
          onClick={() => {
            onClick(index, option.value);
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}
