/* eslint-disable default-case */
import * as React from 'react';
import classNames from 'classnames';
import { useBaseProps } from 'rc-select';
import KeyCode from 'rc-util/lib/KeyCode';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import Column from './Column';
import { restoreCompatibleValue } from '../util';
import CascaderContext from '../context';
import type { DefaultOptionType, SingleValueType } from '../Cascader';
import { isLeaf, toPathKeys } from '../utils/commonUtil';
import useActive from './useActive';
import useKeyboard from './useKeyboard';

const RefOptionList = React.forwardRef<RefOptionListProps>((props, ref) => {
  const {
    prefixCls,
    multiple,
    searchValue,
    toggleOpen,
    notFoundContent,
    direction,
  } = useBaseProps();

  const containerRef = React.useRef<HTMLDivElement>();
  const rtl = direction === 'rtl';

  const {
    options,
    values,
    halfValues,
    fieldNames,
    changeOnSelect,
    onSelect,
    searchOptions,
    dropdownPrefixCls,
    loadData,
    expandTrigger,
  } = React.useContext(CascaderContext);

  const mergedPrefixCls = dropdownPrefixCls || prefixCls;

  // ========================= loadData =========================
  const [loadingKeys, setLoadingKeys] = React.useState([]);

  const internalLoadData = (pathValue: React.Key) => {
    // Do not load when search
    if (!loadData || searchValue) {
      return;
    }

    const entity = flattenOptions.find(flattenOption => flattenOption.data.value === pathValue);
    if (entity && !isLeaf(entity.data.node as any)) {
      const { options: optionList } = restoreCompatibleValue(entity as any, fieldNames);
      const rawOptionList = optionList.map(opt => opt.node);

      setLoadingKeys(keys => [...keys, entity.key]);

      loadData(rawOptionList);
    }
  };

  // zombieJ: This is bad. We should make this same as `rc-tree` to use Promise instead.
  // React.useEffect(() => {
  //   if (loadingKeys.length) {
  //     loadingKeys.forEach(loadingKey => {
  //       const option = flattenOptions.find(opt => opt.value === loadingKey);
  //       if (!option || option.data.children || option.data.isLeaf === true) {
  //         setLoadingKeys(keys => keys.filter(key => key !== loadingKey));
  //       }
  //     });
  //   }
  // }, [flattenOptions, loadingKeys]);

  // ========================== Values ==========================
  const checkedSet = React.useMemo(() => new Set(toPathKeys(values)), [values]);
  const halfCheckedSet = React.useMemo(() => new Set(toPathKeys(halfValues)), [halfValues]);

  // ====================== Accessibility =======================
  const [activeValueCells, setActiveValueCells] = useActive();

  // =========================== Path ===========================
  // const onPathOpen = (index: number, pathValue: React.Key) => {
  //   setOpenFinalValue(pathValue);

  //   // Trigger loadData
  //   internalLoadData(pathValue);
  // };

  const isSelectable = (option: DefaultOptionType) => {
    const { disabled } = option;

    const isMergedLeaf = isLeaf(option, fieldNames);
    return !disabled && (isMergedLeaf || changeOnSelect || multiple);
  };

  const onPathSelect = (valuePath: SingleValueType, leaf: boolean) => {
    onSelect(valuePath, leaf);

    if (!multiple && (leaf || (changeOnSelect && expandTrigger === 'hover'))) {
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

    for (let i = 0; i < activeValueCells.length; i += 1) {
      const activeValueCell = activeValueCells[i];
      const currentOption = currentList.find(
        option => option[fieldNames.value] === activeValueCell,
      );

      const subOptions = currentOption?.[fieldNames.children];
      if (!subOptions) {
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
      onPathSelect(selectValueCells, isLeaf(option, fieldNames));
    }
  };

  useKeyboard(
    ref,
    mergedOptions,
    fieldNames,
    activeValueCells,
    setActiveValueCells,
    containerRef,
    onKeyboardSelect,
  );

  // ========================== Render ==========================
  // >>>>> Empty
  const isEmpty = !optionColumns[0]?.options?.length;

  const emptyList: DefaultOptionType[] = [
    {
      [fieldNames.label as 'label']: notFoundContent,
      [fieldNames.value as 'value']: '__EMPTY__',
      disabled: true,
    },
  ];

  const columnProps = {
    ...props,
    multiple: !isEmpty && multiple,
    onSelect: onPathSelect,
    onActive: setActiveValueCells,
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
    <>
      <div
        className={classNames(`${mergedPrefixCls}-menus`, {
          [`${mergedPrefixCls}-menu-empty`]: isEmpty,
          [`${mergedPrefixCls}-rtl`]: rtl,
        })}
        ref={containerRef}
      >
        {columnNodes}
      </div>
    </>
  );
});

export default RefOptionList;
