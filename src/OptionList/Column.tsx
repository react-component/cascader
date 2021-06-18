import * as React from 'react';
import classNames from 'classnames';
import type { DataNode } from '../interface';

export interface ColumnProps {
  prefixCls: string;
  index: number;
  multiple?: boolean;
  options: DataNode[];
  /** Current Column opened item key */
  openKey?: React.Key;
  onClick: (index: number, value: React.Key, isLeaf: boolean) => void;
}

export default function Column({ prefixCls, index, multiple, options, onClick }: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;

  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map((option) => {
        // >>>> Selection
        const triggerSelect = () => {
          const { isLeaf, children } = option;
          const isMergedLeaf = isLeaf !== undefined ? isLeaf : !children?.length;

          onClick(index, option.value, isMergedLeaf);
        };

        // >>>>> Render
        return (
          <li
            key={option.value}
            className={classNames(menuItemPrefixCls)}
            role="menuitemcheckbox"
            onClick={!multiple ? triggerSelect : null}
          >
            {multiple && (
              <span
                className={classNames(
                  `${prefixCls}-checkbox`,
                  // checked && `${prefixCls}-checkbox-checked`,
                  // !checked && halfChecked && `${prefixCls}-checkbox-indeterminate`,
                  // (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`,
                )}
                onClick={triggerSelect}
              />
            )}
            {option.label}
          </li>
        );
      })}
    </ul>
  );
}
