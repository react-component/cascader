import * as React from 'react';
import classNames from 'classnames';
import type { OptionDataNode } from '../interface';
import { isLeaf } from '../util';
import CascaderContext from '../context';
import Checkbox from './Checkbox';

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
  isEmpty: boolean;
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
  isEmpty,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;

  const { changeOnSelect, expandTrigger, expandIcon, loadingIcon, dropdownMenuColumnStyle } =
    React.useContext(CascaderContext);

  const hoverOpen = expandTrigger === 'hover';

  // ============================ Render ============================
  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map(option => {
        const { disabled, value, node } = option;
        const isMergedLeaf = isLeaf(option);

        const isLoading = loadingKeys.includes(value);

        // >>>>> checked
        const checked = checkedSet.has(value);

        // >>>>> Open
        const triggerOpenPath = () => {
          if (!disabled && (!hoverOpen || !isMergedLeaf)) {
            onOpen(index, value);
          }
        };

        // >>>>> Selection
        const triggerSelect = () => {
          if (!disabled && (isMergedLeaf || changeOnSelect || multiple)) {
            onSelect(value, isMergedLeaf);
          }
        };

        // >>>>> Title
        let title: string;
        if (typeof node?.title === 'string') {
          title = node.title;
        } else if (typeof option.title === 'string') {
          title = option.title;
        }

        // >>>>> Render
        return (
          <li
            key={value}
            className={classNames(menuItemPrefixCls, {
              [`${menuItemPrefixCls}-expand`]: !isMergedLeaf,
              [`${menuItemPrefixCls}-active`]: openKey === value,
              [`${menuItemPrefixCls}-disabled`]: disabled,
              [`${menuItemPrefixCls}-loading`]: isLoading,
            })}
            style={dropdownMenuColumnStyle}
            role="menuitemcheckbox"
            title={title}
            aria-checked={checked}
            data-value={value}
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
            onMouseEnter={() => {
              if (hoverOpen) {
                triggerOpenPath();
              }
            }}
          >
            {multiple && !isEmpty && (
              <Checkbox
                prefixCls={`${prefixCls}-checkbox`}
                checked={checked}
                halfChecked={halfCheckedSet.has(value)}
                disabled={disabled}
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  e.stopPropagation();
                  triggerSelect();
                }}
              />
            )}
            <div className={`${menuItemPrefixCls}-content`}>{option.title}</div>
            {!isLoading && expandIcon && !isMergedLeaf && (
              <div className={`${menuItemPrefixCls}-expand-icon`}>{expandIcon}</div>
            )}
            {isLoading && loadingIcon && (
              <div className={`${menuItemPrefixCls}-loading-icon`}>{loadingIcon}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
