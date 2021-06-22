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
  onSelect: (value: React.Key) => void;
  onOpen: (index: number, value: React.Key) => void;
  changeOnSelect: boolean;
  checkedSet: Set<React.Key>;
  halfCheckedSet: Set<React.Key>;
}

export default function Column({
  prefixCls,
  index,
  multiple,
  options,
  openKey,
  onSelect,
  onOpen,
  changeOnSelect,
  checkedSet,
  halfCheckedSet,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;
  const checkboxPrefixCls = `${menuItemPrefixCls}-checkbox`;

  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map((option) => {
        const { isLeaf, children, disabled, value } = option;
        const isMergedLeaf = isLeaf !== undefined ? isLeaf : !children?.length;

        // >>>>> checked
        const checked = checkedSet.has(value);

        // >>>>> Open
        const triggerOpen = () => {
          if (!disabled && !isMergedLeaf) {
            onOpen(index, value);
          }
        };

        // >>>>> Selection
        const triggerSelect = () => {
          if (!disabled && (isMergedLeaf || changeOnSelect || multiple)) {
            onSelect(value);
          }
        };

        // >>>>> Render
        return (
          <li
            key={value}
            className={classNames(menuItemPrefixCls, {
              [`${menuItemPrefixCls}-active`]: openKey === value,
              [`${menuItemPrefixCls}-selected`]: !multiple && checked,
              [`${menuItemPrefixCls}-disabled`]: disabled,
            })}
            role="menuitemcheckbox"
            onClick={() => {}}
          >
            {multiple && (
              <span
                className={classNames(
                  checkboxPrefixCls,
                  {
                    [`${checkboxPrefixCls}-checked`]: checked,
                    [`${checkboxPrefixCls}-indeterminate`]: !checked && halfCheckedSet.has(value),
                  },
                  // (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`,
                )}
                onClick={() => {
                  triggerSelect();
                }}
              />
            )}
            <div
              className={`${menuItemPrefixCls}-content`}
              onClick={() => {
                triggerOpen();
                if (!multiple || isMergedLeaf) {
                  triggerSelect();
                }
              }}
            >
              {option.label}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
