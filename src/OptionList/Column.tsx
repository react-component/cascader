import * as React from 'react';
import classNames from 'classnames';
import { isLeaf, toPathKey } from '../utils/commonUtil';
import LegacyContext from '../LegacyContext';
import CascaderContext from '../context';
import Checkbox from './Checkbox';
import type { DefaultOptionType, SingleValueType } from '../Cascader';
import { SEARCH_MARK } from '../hooks/useSearchOptions';

export interface ColumnProps {
  prefixCls: string;
  multiple?: boolean;
  options: DefaultOptionType[];
  /** Current Column opened item key */
  activeValue?: React.Key;
  /** The value path before current column */
  prevValuePath: React.Key[];
  onToggleOpen: (open: boolean) => void;
  onSelect: (valuePath: SingleValueType, leaf: boolean) => void;
  onActive: (valuePath: SingleValueType) => void;
  checkedSet: Set<React.Key>;
  halfCheckedSet: Set<React.Key>;
  loadingKeys: React.Key[];
}

export default function Column({
  prefixCls,
  multiple,
  options,
  activeValue,
  prevValuePath,
  onToggleOpen,
  onSelect,
  onActive,
  checkedSet,
  halfCheckedSet,
  loadingKeys,
}: ColumnProps) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;

  const { expandTrigger, expandIcon, loadingIcon, dropdownMenuColumnStyle } =
    React.useContext(LegacyContext);

  const { fieldNames, changeOnSelect } = React.useContext(CascaderContext);

  const hoverOpen = expandTrigger === 'hover';

  // ============================ Render ============================
  return (
    <ul className={menuPrefixCls} role="menu">
      {options.map(option => {
        const { disabled, value, node } = option;
        const searchOptions = option[SEARCH_MARK];

        const isMergedLeaf = isLeaf(option, fieldNames);

        // Get real value of option. Search option is different way.
        const fullPath = searchOptions
          ? searchOptions.map(opt => opt[fieldNames.value])
          : [...prevValuePath, value];
        const fullPathKey = toPathKey(fullPath);

        const isLoading = loadingKeys.includes(value);

        // >>>>> checked
        const checked = checkedSet.has(fullPathKey);

        // >>>>> Open
        const triggerOpenPath = () => {
          if (!disabled && (!hoverOpen || !isMergedLeaf)) {
            onActive(fullPath);
          }
        };

        // >>>>> Selection
        const triggerSelect = () => {
          if (!disabled && (isMergedLeaf || changeOnSelect || multiple)) {
            onSelect(fullPath, isMergedLeaf);
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
            key={fullPathKey}
            className={classNames(menuItemPrefixCls, {
              [`${menuItemPrefixCls}-expand`]: !isMergedLeaf,
              [`${menuItemPrefixCls}-active`]: activeValue === value,
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
            {multiple && (
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
            <div className={`${menuItemPrefixCls}-content`}>{option[fieldNames.label]}</div>
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
