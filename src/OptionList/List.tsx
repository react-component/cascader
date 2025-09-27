/* eslint-disable default-case */
import { clsx } from 'clsx';
import type { useBaseProps } from '@rc-component/select';
import type { RefOptionListProps } from '@rc-component/select/lib/OptionList';
import * as React from 'react';
import type { DefaultOptionType, LegacyKey, SingleValueType } from '../Cascader';
import CascaderContext from '../context';
import {
  getFullPathKeys,
  isLeaf,
  scrollIntoParentView,
  toPathKey,
  toPathKeys,
  toPathValueStr,
} from '../utils/commonUtil';
import { toPathOptions } from '../utils/treeUtil';
import CacheContent from './CacheContent';
import Column, { FIX_LABEL } from './Column';
import useActive from './useActive';
import useKeyboard from './useKeyboard';

export type RawOptionListProps = Pick<
  ReturnType<typeof useBaseProps>,
  | 'prefixCls'
  | 'multiple'
  | 'searchValue'
  | 'toggleOpen'
  | 'notFoundContent'
  | 'direction'
  | 'open'
  | 'disabled'
>;

const RawOptionList = React.forwardRef<RefOptionListProps, RawOptionListProps>((props, ref) => {
  const {
    prefixCls,
    multiple,
    searchValue,
    toggleOpen,
    notFoundContent,
    direction,
    open,
    disabled,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const rtl = direction === 'rtl';

  const {
    options,
    values,
    halfValues,
    fieldNames,
    changeOnSelect,
    onSelect,
    searchOptions,
    popupPrefixCls,
    loadData,
    expandTrigger,
  } = React.useContext(CascaderContext);

  const mergedPrefixCls = popupPrefixCls || prefixCls;

  // ========================= loadData =========================
  const [loadingKeys, setLoadingKeys] = React.useState<LegacyKey[]>([]);

  const internalLoadData = (valueCells: LegacyKey[]) => {
    // Do not load when search
    if (!loadData || searchValue) {
      return;
    }

    const optionList = toPathOptions(valueCells, options, fieldNames);
    const rawOptions = optionList.map(({ option }) => option);
    const lastOption = rawOptions[rawOptions.length - 1];

    if (lastOption && !isLeaf(lastOption, fieldNames)) {
      const pathKey = toPathKey(valueCells);

      setLoadingKeys(keys => [...keys, pathKey]);

      loadData(rawOptions);
    }
  };

  // zombieJ: This is bad. We should make this same as `rc-tree` to use Promise instead.
  React.useEffect(() => {
    if (loadingKeys.length) {
      loadingKeys.forEach(loadingKey => {
        const valueStrCells = toPathValueStr(loadingKey as string);
        const optionList = toPathOptions(valueStrCells, options, fieldNames, true).map(
          ({ option }) => option,
        );
        const lastOption = optionList[optionList.length - 1];

        if (!lastOption || lastOption[fieldNames.children] || isLeaf(lastOption, fieldNames)) {
          setLoadingKeys(keys => keys.filter(key => key !== loadingKey));
        }
      });
    }
  }, [options, loadingKeys, fieldNames]);

  // ========================== Values ==========================
  const checkedSet = React.useMemo(() => new Set(toPathKeys(values)), [values]);
  const halfCheckedSet = React.useMemo(() => new Set(toPathKeys(halfValues)), [halfValues]);

  // ====================== Accessibility =======================
  const [activeValueCells, setActiveValueCells] = useActive(multiple, open);

  // =========================== Path ===========================
  const onPathOpen = (nextValueCells: LegacyKey[]) => {
    setActiveValueCells(nextValueCells);

    // Trigger loadData
    internalLoadData(nextValueCells);
  };

  const isSelectable = (option: DefaultOptionType) => {
    if (disabled) {
      return false;
    }

    const { disabled: optionDisabled } = option;
    const isMergedLeaf = isLeaf(option, fieldNames);

    return !optionDisabled && (isMergedLeaf || changeOnSelect || multiple);
  };

  const onPathSelect = (valuePath: SingleValueType, leaf: boolean, fromKeyboard = false) => {
    onSelect(valuePath);

    if (!multiple && (leaf || (changeOnSelect && (expandTrigger === 'hover' || fromKeyboard)))) {
      toggleOpen(false);
    }
  };

  // ========================== Option ==========================
  const mergedOptions = React.useMemo(() => {
    if (searchValue) {
      return searchOptions;
    }

    return options;
  }, [searchValue, searchOptions, options]);

  // ========================== Column ==========================
  const optionColumns = React.useMemo(() => {
    const optionList = [{ options: mergedOptions }];
    let currentList = mergedOptions;

    const fullPathKeys = getFullPathKeys(currentList, fieldNames);

    for (let i = 0; i < activeValueCells.length; i += 1) {
      const activeValueCell = activeValueCells[i];
      const currentOption = currentList.find(
        (option, index) =>
          (fullPathKeys[index] ? toPathKey(fullPathKeys[index]) : option[fieldNames.value]) ===
          activeValueCell,
      );

      const subOptions = currentOption?.[fieldNames.children];
      if (!subOptions?.length) {
        break;
      }

      currentList = subOptions;
      optionList.push({ options: subOptions });
    }

    return optionList;
  }, [mergedOptions, activeValueCells, fieldNames]);

  // ========================= Keyboard =========================
  const onKeyboardSelect = (selectValueCells: SingleValueType, option: DefaultOptionType) => {
    if (isSelectable(option)) {
      onPathSelect(selectValueCells, isLeaf(option, fieldNames), true);
    }
  };

  useKeyboard(ref, mergedOptions, fieldNames, activeValueCells, onPathOpen, onKeyboardSelect, {
    direction,
    searchValue,
    toggleOpen,
    open,
  });

  // >>>>> Active Scroll
  React.useEffect(() => {
    if (searchValue) {
      return;
    }
    for (let i = 0; i < activeValueCells.length; i += 1) {
      const cellPath = activeValueCells.slice(0, i + 1);
      const cellKeyPath = toPathKey(cellPath);
      const ele = containerRef.current?.querySelector<HTMLElement>(
        `li[data-path-key="${cellKeyPath.replace(/\\{0,2}"/g, '\\"')}"]`, // matches unescaped double quotes
      );
      if (ele) {
        scrollIntoParentView(ele);
      }
    }
  }, [activeValueCells, searchValue]);

  // ========================== Render ==========================
  // >>>>> Empty
  const isEmpty = !optionColumns[0]?.options?.length;

  const emptyList: DefaultOptionType[] = [
    {
      [fieldNames.value as 'value']: '__EMPTY__',
      [FIX_LABEL as 'label']: notFoundContent,
      disabled: true,
    },
  ];

  const columnProps = {
    ...props,
    multiple: !isEmpty && multiple,
    onSelect: onPathSelect,
    onActive: onPathOpen,
    onToggleOpen: toggleOpen,
    checkedSet,
    halfCheckedSet,
    loadingKeys,
    isSelectable,
  };

  // >>>>> Columns
  const mergedOptionColumns = isEmpty ? [{ options: emptyList }] : optionColumns;

  const columnNodes: React.ReactElement[] = mergedOptionColumns.map((col, index) => {
    const prevValuePath = activeValueCells.slice(0, index);
    const activeValue = activeValueCells[index];

    return (
      <Column
        key={index}
        {...columnProps}
        prefixCls={mergedPrefixCls}
        options={col.options}
        prevValuePath={prevValuePath}
        activeValue={activeValue}
      />
    );
  });

  // >>>>> Render
  return (
    <CacheContent open={open}>
      <div
        className={clsx(`${mergedPrefixCls}-menus`, {
          [`${mergedPrefixCls}-menu-empty`]: isEmpty,
          [`${mergedPrefixCls}-rtl`]: rtl,
        })}
        ref={containerRef}
      >
        {columnNodes}
      </div>
    </CacheContent>
  );
});

if (process.env.NODE_ENV !== 'production') {
  RawOptionList.displayName = 'RawOptionList';
}

export default RawOptionList;
