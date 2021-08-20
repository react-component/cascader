import * as React from 'react';
import classNames from 'classnames';
import type { OptionDataNode } from '../interface';
import { isLeaf } from '../util';
import CascaderContext from '../context';

export interface ColumnProps {
  prefixCls: string;
  index: number;
  multiple?: boolean;
  options: OptionDataNode[];
  /** Current Column opened item key */
  openKey?: React.Key;
  onSelect: (value: React.Key, isLeaf: boolean) => void;
  onOpen: (index: number, value: React.Key) => void;
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
  checkedSet,
  halfCheckedSet,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;
  const checkboxPrefixCls = `${menuItemPrefixCls}-checkbox`;

  const { changeOnSelect, expandTrigger, expandIcon } = React.useContext(CascaderContext);

  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map(option => {
        const { disabled, value } = option;
        const isMergedLeaf = isLeaf(option);

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
            onSelect(value, isMergedLeaf);
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
            aria-checked={checked}
            onMouseEnter={() => {
              if (expandTrigger) {
                triggerOpen();
              }
            }}
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
              {option.title}
            </div>
            {expandIcon && !isMergedLeaf && (
              <div className={`${menuItemPrefixCls}-expand-icon`}>{expandIcon}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
