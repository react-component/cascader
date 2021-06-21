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

  const clickLockRef = React.useRef(false);

  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map((option) => {
        const { isLeaf, children, disabled } = option;

        // >>>>> Selection
        const triggerSelect = () => {
          if (!disabled) {
            const isMergedLeaf = isLeaf !== undefined ? isLeaf : !children?.length;

            onClick(index, option.value, isMergedLeaf);
          }
        };

        // >>>>> Render
        return (
          <li
            key={option.value}
            className={classNames(menuItemPrefixCls, {
              [`${menuItemPrefixCls}-disabled`]: disabled,
            })}
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
                onClick={() => {
                  clickLockRef.current = true;
                  triggerSelect();
                  Promise.resolve().then(() => {
                    clickLockRef.current = false;
                  });
                }}
              />
            )}
            {option.label}
          </li>
        );
      })}
    </ul>
  );
}
