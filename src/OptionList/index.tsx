/* eslint-disable default-case */
import * as React from 'react';
import classNames from 'classnames';
import { useBaseProps } from 'rc-select';
import KeyCode from 'rc-util/lib/KeyCode';
import type {
  OptionListProps as SelectOptionListProps,
  RefOptionListProps,
} from 'rc-select/lib/OptionList';
// import { SelectContext } from 'rc-tree-select/lib/Context';
import type { OptionDataNode } from '../interface';
import Column from './Column';
import { restoreCompatibleValue } from '../util';
import LegacyContext from '../LegacyContext';
import useSearchResult from '../hooks/useSearchResult';
import CascaderContext from '../context';
import type { SingleValueType } from '../Cascader';
import { isLeaf, toPathKeys } from '../utils/commonUtil';

const RefOptionList = React.forwardRef<RefOptionListProps>((props, ref) => {
  const {
    prefixCls,
    // onSelect,
    multiple,
    open,
    // flattenOptions,
    searchValue,
    toggleOpen,
    notFoundContent,
    direction,
  } = useBaseProps();

  const containerRef = React.useRef<HTMLDivElement>();
  const rtl = direction === 'rtl';

  const { options, values, halfValues, fieldNames, changeOnSelect, onSelect } =
    React.useContext(CascaderContext);

  // const { checkedKeys, halfCheckedKeys } = React.useContext(SelectContext);
  const { expandTrigger, loadData, search, dropdownPrefixCls } = React.useContext(LegacyContext);

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

  // ========================== Active ==========================
  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<React.Key[]>([]);

  React.useEffect(() => {
    if (!multiple) {
      const firstValueCells = values[0];
      setActiveValueCells(firstValueCells || []);
    }
  }, [multiple, values]);

  // ====================== Active Options ======================
  const optionColumns = React.useMemo(() => {
    const optionList = [{ options }];
    let currentList = options;

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
  }, [options, activeValueCells, fieldNames]);

  // =========================== Open ===========================
  const [openFinalValue, setOpenFinalValue] = React.useState<React.Key>(null);

  const mergedOpenPath = [];
  // const mergedOpenPath = React.useMemo<React.Key[]>(() => {
  //   if (searchValue) {
  //     return openFinalValue !== undefined && openFinalValue !== null ? [openFinalValue] : [];
  //   }

  //   const entity = flattenOptions.find(
  //     flattenOption => flattenOption.data.value === openFinalValue,
  //   );

  //   if (entity) {
  //     const { path } = restoreCompatibleValue(entity as any, fieldNames);
  //     return path;
  //   }

  //   return [];
  // }, [openFinalValue, searchValue]);

  // React.useEffect(() => {
  //   if (open) {
  //     let nextOpenPath: React.Key = null;

  //     if (!multiple && checkedKeys.length) {
  //       const entity = flattenOptions.find(
  //         flattenOption => flattenOption.data.value === checkedKeys[0],
  //       );

  //       if (entity) {
  //         nextOpenPath = entity.data.value;
  //       }
  //     }
  //     setOpenFinalValue(nextOpenPath);
  //   }
  // }, [open]);

  // =========================== Path ===========================
  // const onPathOpen = (index: number, pathValue: React.Key) => {
  //   setOpenFinalValue(pathValue);

  //   // Trigger loadData
  //   internalLoadData(pathValue);
  // };

  const onPathSelect = (valuePath: SingleValueType, leaf: boolean) => {
    onSelect(valuePath, leaf);

    if (!multiple && (leaf || (changeOnSelect && expandTrigger === 'hover'))) {
      toggleOpen(false);
    }
  };

  const onPathActive = (valuePath: SingleValueType) => {
    setActiveValueCells(valuePath);
  };

  // const getPathList = (pathList: React.Key[]) => {
  //   let currentOptions = options;

  //   for (let i = 0; i < pathList.length; i += 1) {
  //     currentOptions = (currentOptions || []).find(option => option.value === pathList[i]).children;
  //   }

  //   return currentOptions;
  // };

  // ========================== Search ==========================
  // const searchOptions = useSearchResult({
  //   ...props,
  //   prefixCls: mergedPrefixCls,
  //   fieldNames,
  //   changeOnSelect,
  //   searchConfig: search,
  // });

  // ========================== Column ==========================
  // const optionColumns = React.useMemo(() => {
  //   // if (searchValue) {
  //   //   return [
  //   //     {
  //   //       options: searchOptions,
  //   //     },
  //   //   ];
  //   // }

  //   const rawOptionColumns: {
  //     options: OptionDataNode[];
  //   }[] = [];

  //   for (let i = 0; i <= mergedOpenPath.length; i += 1) {
  //     const subOptions = getPathList(mergedOpenPath.slice(0, i));

  //     if (subOptions) {
  //       rawOptionColumns.push({
  //         options: subOptions,
  //       });
  //     } else {
  //       break;
  //     }
  //   }

  //   return rawOptionColumns;
  // }, [searchValue, mergedOpenPath]);
  // // }, [searchValue, searchOptions, mergedOpenPath]);

  // ========================= Keyboard =========================
  const getActiveOption = (activeColumnIndex: number, offset: number) => {
    const pathActiveValue = mergedOpenPath[activeColumnIndex];
    const currentOptions = optionColumns[activeColumnIndex]?.options || [];
    let activeOptionIndex = currentOptions.findIndex(opt => opt.value === pathActiveValue);

    const len = currentOptions.length;

    // Last one is special since -1 may back 2 offset
    if (offset === -1 && activeOptionIndex === -1) {
      activeOptionIndex = len;
    }

    for (let i = 1; i <= len; i += 1) {
      const current = (activeOptionIndex + i * offset + len) % len;
      const option = currentOptions[current];

      if (!option.disabled) {
        return option;
      }
    }

    return null;
  };

  const prevColumn = () => {
    if (mergedOpenPath.length <= 1) {
      toggleOpen(false);
    }
    setOpenFinalValue(mergedOpenPath[mergedOpenPath.length - 2]);
  };

  const nextColumn = () => {
    const nextColumnIndex = mergedOpenPath.length;
    const nextActiveOption = getActiveOption(nextColumnIndex, 1);
    if (nextActiveOption) {
      onPathOpen(nextColumnIndex, nextActiveOption.value);
    }
  };

  React.useImperativeHandle(ref, () => ({
    // scrollTo: treeRef.current?.scrollTo,
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          }

          if (offset !== 0) {
            const activeColumnIndex = Math.max(mergedOpenPath.length - 1, 0);
            const nextActiveOption = getActiveOption(activeColumnIndex, offset);
            if (nextActiveOption) {
              const ele = containerRef.current?.querySelector(
                `li[data-value="${nextActiveOption.value}"]`,
              );
              ele?.scrollIntoView?.({ block: 'nearest' });

              onPathOpen(activeColumnIndex, nextActiveOption.value);
            }
          }

          break;
        }

        case KeyCode.LEFT: {
          if (rtl) {
            nextColumn();
          } else {
            prevColumn();
          }
          break;
        }

        case KeyCode.RIGHT: {
          if (rtl) {
            prevColumn();
          } else {
            nextColumn();
          }
          break;
        }

        case KeyCode.BACKSPACE: {
          if (!searchValue) {
            prevColumn();
          }
          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          const lastValue = mergedOpenPath[mergedOpenPath.length - 1];
          const option = optionColumns[mergedOpenPath.length - 1]?.options?.find(
            opt => opt.value === lastValue,
          );

          // Skip when no select
          if (option) {
            const leaf = isLeaf(option, fieldNames);

            if (multiple || changeOnSelect || leaf) {
              onPathSelect(lastValue, leaf);
            }

            // Close for changeOnSelect
            if (changeOnSelect) {
              toggleOpen(false);
            }
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);

          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},
  }));

  // ========================== Render ==========================
  const columnProps = {
    ...props,
    multiple,
    onSelect: onPathSelect,
    onActive: onPathActive,
    onToggleOpen: toggleOpen,
    // TODO: handle this
    checkedSet,
    halfCheckedSet,
    loadingKeys,
  };

  // >>>>> Empty
  const isEmpty = !optionColumns[0]?.options?.length;

  const emptyList: OptionDataNode[] = [
    {
      title: notFoundContent,
      value: '__EMPTY__',
      disabled: true,
      node: null,
    },
  ];

  // >>>>> Columns
  const mergedOptionColumns = isEmpty ? [{ options: emptyList }] : optionColumns;

  const columnNodes: React.ReactElement[] = mergedOptionColumns.map((col, index) => (
    <Column
      key={index}
      index={index}
      {...columnProps}
      prefixCls={mergedPrefixCls}
      options={col.options}
      // TODO: handle search case
      prevValuePath={activeValueCells.slice(0, index)}
      activeValue={activeValueCells[index]}
    />
  ));

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
