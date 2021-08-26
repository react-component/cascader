/* eslint-disable default-case */
import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import type {
  OptionListProps as SelectOptionListProps,
  RefOptionListProps,
} from 'rc-select/lib/OptionList';
import { SelectContext } from 'rc-tree-select/lib/Context';
import type { OptionDataNode } from '../interface';
import Column from './Column';
import { isLeaf, restoreCompatibleValue } from '../util';
import CascaderContext from '../context';
import useSearchResult from '../hooks/useSearchResult';

type OptionListProps = SelectOptionListProps<OptionDataNode[]>;
export type FlattenOptions = OptionListProps['flattenOptions'];

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps>((props, ref) => {
  const {
    prefixCls,
    options,
    onSelect,
    multiple,
    open,
    flattenOptions,
    searchValue,
    onToggleOpen,
    notFoundContent,
    direction,
  } = props;

  const rtl = direction === 'rtl';

  const { checkedKeys, halfCheckedKeys } = React.useContext(SelectContext);
  const { changeOnSelect, expandTrigger, fieldNames, loadData, search } =
    React.useContext(CascaderContext);

  // ========================= loadData =========================
  const [loadingKeys, setLoadingKeys] = React.useState([]);

  const internalLoadData = (pathValue: React.Key) => {
    if (!loadData) {
      return;
    }

    const entity = flattenOptions.find(flattenOption => flattenOption.data.value === pathValue);
    if (entity) {
      const { options: optionList } = restoreCompatibleValue(entity as any, fieldNames);
      const rawOptionList = optionList.map(opt => opt.node);

      setLoadingKeys(keys => [...keys, optionList[optionList.length - 1].value]);

      loadData(rawOptionList);
    }
  };

  // zombieJ: This is bad. We should make this same as `rc-tree` to use Promise instead.
  React.useEffect(() => {
    if (loadingKeys.length) {
      loadingKeys.forEach(loadingKey => {
        const option = flattenOptions.find(opt => opt.value === loadingKey);
        if (option.data.children) {
          setLoadingKeys(keys => keys.filter(key => key !== loadingKey));
        }
      });
    }
  }, [flattenOptions, loadingKeys]);

  // ========================== Values ==========================
  const checkedSet = React.useMemo(() => new Set(checkedKeys), [checkedKeys]);
  const halfCheckedSet = React.useMemo(() => new Set(halfCheckedKeys), [halfCheckedKeys]);

  // =========================== Open ===========================
  const [openPath, setOpenPath] = React.useState<React.Key[]>([]);

  React.useEffect(() => {
    if (open) {
      let nextOpenPath: React.Key[] = [];

      if (!multiple && checkedKeys.length) {
        const entity = flattenOptions.find(
          flattenOption => flattenOption.data.value === checkedKeys[0],
        );

        if (entity) {
          nextOpenPath = restoreCompatibleValue(entity as any, fieldNames).path;
        }
      }
      setOpenPath(nextOpenPath);
    }
  }, [open]);

  // =========================== Path ===========================
  const onPathOpen = (index: number, pathValue: React.Key) => {
    const nextOpenPath = [...openPath.slice(0, index), pathValue];
    setOpenPath(nextOpenPath);

    // Trigger loadData
    internalLoadData(pathValue);
  };

  const onPathSelect = (pathValue: React.Key, leaf: boolean) => {
    onSelect(pathValue, { selected: !checkedSet.has(pathValue) });

    if (!multiple && (leaf || (changeOnSelect && expandTrigger === 'hover'))) {
      onToggleOpen(false);
    }
  };

  const getPathList = (pathList: React.Key[]) => {
    let currentOptions = options;

    for (let i = 0; i < pathList.length; i += 1) {
      currentOptions = (currentOptions || []).find(option => option.value === pathList[i]).children;
    }

    return currentOptions;
  };

  // ========================== Search ==========================
  const searchOptions = useSearchResult({
    ...props,
    fieldNames,
    changeOnSelect,
    searchConfig: search,
  });

  // ========================== Column ==========================
  const optionColumns = React.useMemo(() => {
    if (searchValue) {
      return [
        {
          options: searchOptions,
        },
      ];
    }

    const rawOptionColumns: {
      options: OptionDataNode[];
    }[] = [];

    for (let i = 0; i <= openPath.length; i += 1) {
      const subOptions = getPathList(openPath.slice(0, i));

      if (subOptions) {
        rawOptionColumns.push({
          options: subOptions,
        });
      } else {
        break;
      }
    }

    return rawOptionColumns;
  }, [searchValue, searchOptions, openPath]);

  // ========================= Keyboard =========================
  const getActiveOption = (activeColumnIndex: number, offset: number) => {
    const pathActiveValue = openPath[activeColumnIndex];
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
    if (openPath.length <= 1) {
      onToggleOpen(false);
    }
    setOpenPath(openPath.slice(0, -1));
  };

  const nextColumn = () => {
    const nextColumnIndex = openPath.length;
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
            const activeColumnIndex = Math.max(openPath.length - 1, 0);
            const nextActiveOption = getActiveOption(activeColumnIndex, offset);
            if (nextActiveOption) {
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
          prevColumn();
          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          const lastValue = openPath[openPath.length - 1];
          const option = optionColumns[openPath.length - 1].options?.find(
            opt => opt.value === lastValue,
          );

          const leaf = isLeaf(option);

          if (multiple || changeOnSelect || leaf) {
            onPathSelect(lastValue, leaf);
          }

          // Close for changeOnSelect
          if (changeOnSelect) {
            onToggleOpen(false);
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          onToggleOpen(false);

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
    onOpen: onPathOpen,
    onSelect: onPathSelect,
    onToggleOpen,
    checkedSet,
    halfCheckedSet,
    loadingKeys,
  };

  // >>>>> Empty
  const emptyList: OptionDataNode[] = [
    {
      title: notFoundContent,
      value: '__EMPTY__',
      disabled: true,
      node: null,
    },
  ];

  // >>>>> Columns
  const mergedOptionColumns = optionColumns[0]?.options?.length
    ? optionColumns
    : [{ options: emptyList }];

  const columnNodes: React.ReactElement[] = mergedOptionColumns.map((col, index) => (
    <Column
      key={index}
      index={index}
      {...columnProps}
      options={col.options}
      openKey={openPath[index]}
    />
  ));

  // >>>>> Render
  return (
    <>
      <div
        className={classNames(`${prefixCls}-holder`, {
          [`${prefixCls}-rtl`]: rtl,
        })}
      >
        {columnNodes}
      </div>
    </>
  );
});

export default RefOptionList;
