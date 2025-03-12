import classNames from 'classnames';
import * as React from 'react';
import type { DefaultOptionType, SingleValueType } from '../Cascader';
import CascaderContext from '../context';
import { SEARCH_MARK } from '../hooks/useSearchOptions';
import { isLeaf, toPathKey, scrollIntoParentView } from '../utils/commonUtil';
import Checkbox from './Checkbox';

export const FIX_LABEL = '__cascader_fix_label__';

export interface ColumnProps<OptionType extends DefaultOptionType = DefaultOptionType> {
  prefixCls: string;
  multiple?: boolean;
  options: OptionType[];
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
  isSelectable: (option: DefaultOptionType) => boolean;
  disabled?: boolean;
}

export default function Column<OptionType extends DefaultOptionType = DefaultOptionType>({
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
  isSelectable,
  disabled: propsDisabled,
}: ColumnProps<OptionType>) {
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;

  const {
    fieldNames,
    changeOnSelect,
    expandTrigger,
    expandIcon,
    loadingIcon,
    dropdownMenuColumnStyle,
    optionRender,
  } = React.useContext(CascaderContext);

  const hoverOpen = expandTrigger === 'hover';

  const isOptionDisabled = (disabled?: boolean) => propsDisabled || disabled;

  // ============================ Option ============================
  const optionInfoList = React.useMemo(
    () =>
      options.map(option => {
        const { disabled, disableCheckbox } = option;
        const searchOptions: Record<string, any>[] = option[SEARCH_MARK];
        const label = option[FIX_LABEL] ?? option[fieldNames.label];
        const value = option[fieldNames.value];

        const isMergedLeaf = isLeaf(option, fieldNames);

        // Get real value of option. Search option is different way.
        const fullPath = searchOptions
          ? searchOptions.map(opt => opt[fieldNames.value])
          : [...prevValuePath, value];
        const fullPathKey = toPathKey(fullPath);

        const isLoading = loadingKeys.includes(fullPathKey);

        // >>>>> checked
        const checked = checkedSet.has(fullPathKey);

        // >>>>> halfChecked
        const halfChecked = halfCheckedSet.has(fullPathKey);

        return {
          disabled,
          label,
          value,
          isLeaf: isMergedLeaf,
          isLoading,
          checked,
          halfChecked,
          option,
          disableCheckbox,
          fullPath,
          fullPathKey,
        };
      }),
    [options, checkedSet, fieldNames, halfCheckedSet, loadingKeys, prevValuePath],
  );

  React.useEffect(() => {
    const escapedValue = String(activeValue).replace(/"/g, '\\"');
    const selector = `[data-path-key="${escapedValue}"]`;
    const activeElement = document.querySelector<HTMLElement>(selector);

    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeValue]);

  // ============================ Render ============================
  return (
    <ul className={menuPrefixCls} role="menu">
      {optionInfoList.map(
        ({
          disabled,
          label,
          value,
          isLeaf: isMergedLeaf,
          isLoading,
          checked,
          halfChecked,
          option,
          fullPath,
          fullPathKey,
          disableCheckbox,
        }) => {
          // >>>>> Open
          const triggerOpenPath = () => {
            if (isOptionDisabled(disabled)) {
              return;
            }
            const nextValueCells = [...fullPath];
            if (hoverOpen && isMergedLeaf) {
              nextValueCells.pop();
            }
            onActive(nextValueCells);
          };

          // >>>>> Selection
          const triggerSelect = () => {
            if (isSelectable(option) && !isOptionDisabled(disabled)) {
              onSelect(fullPath, isMergedLeaf);
            }
          };

          // >>>>> Title
          let title: string | undefined;
          if (typeof option.title === 'string') {
            title = option.title;
          } else if (typeof label === 'string') {
            title = label;
          }

          // >>>>> Render
          return (
            <li
              key={fullPathKey}
              className={classNames(menuItemPrefixCls, {
                [`${menuItemPrefixCls}-expand`]: !isMergedLeaf,
                [`${menuItemPrefixCls}-active`]:
                  activeValue === value || activeValue === fullPathKey,
                [`${menuItemPrefixCls}-disabled`]: isOptionDisabled(disabled),
                [`${menuItemPrefixCls}-loading`]: isLoading,
              })}
              style={dropdownMenuColumnStyle}
              role="menuitemcheckbox"
              title={title}
              aria-checked={checked}
              data-path-key={fullPathKey}
              onClick={() => {
                triggerOpenPath();
                if (disableCheckbox) {
                  return;
                }
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
              onMouseDown={e => {
                // Prevent selector from blurring
                e.preventDefault();
              }}
            >
              {multiple && (
                <Checkbox
                  prefixCls={`${prefixCls}-checkbox`}
                  checked={checked}
                  halfChecked={halfChecked}
                  disabled={isOptionDisabled(disabled) || disableCheckbox}
                  disableCheckbox={disableCheckbox}
                  onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                    if (disableCheckbox) {
                      return;
                    }
                    e.stopPropagation();
                    triggerSelect();
                  }}
                />
              )}
              <div className={`${menuItemPrefixCls}-content`}>
                {optionRender ? optionRender(option) : label}
              </div>
              {!isLoading && expandIcon && !isMergedLeaf && (
                <div className={`${menuItemPrefixCls}-expand-icon`}>{expandIcon}</div>
              )}
              {isLoading && loadingIcon && (
                <div className={`${menuItemPrefixCls}-loading-icon`}>{loadingIcon}</div>
              )}
            </li>
          );
        },
      )}
    </ul>
  );
}
