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
  onToggleOpen: (open: boolean) => void;
  checkedSet: Set<React.Key>;
  halfCheckedSet: Set<React.Key>;
  loadingKeys: React.Key[];
}

export default function Column({
  prefixCls,
  index,
  multiple,
  options,
  openKey,
  onSelect,
  onOpen,
  onToggleOpen,
  checkedSet,
  halfCheckedSet,
  loadingKeys,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;
  const checkboxPrefixCls = `${menuItemPrefixCls}-checkbox`;

  const { changeOnSelect, expandTrigger, expandIcon, loadingIcon } =
    React.useContext(CascaderContext);

  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map(option => {
        const { disabled, value } = option;
        const isMergedLeaf = isLeaf(option);

        const isLoading = loadingKeys.includes(value);

        // >>>>> checked
        const checked = checkedSet.has(value);

        // >>>>> Open
        const triggerOpenPath = () => {
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
                triggerOpenPath();
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
                triggerOpenPath();
                if (!multiple || isMergedLeaf) {
                  triggerSelect();
                }
              }}
              onDoubleClick={() => {
                if (changeOnSelect) {
                  onToggleOpen(false);
                }
              }}
            >
              {option.title}
            </div>
            {!isLoading && expandIcon && !isMergedLeaf && (
              <div className={`${menuItemPrefixCls}-expand-icon`}>{expandIcon}</div>
            )}
            {isLoading && loadingIcon && (
              <div className={`${menuItemPrefixCls}-loading`}>{loadingIcon}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
