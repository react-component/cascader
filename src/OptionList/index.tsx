import * as React from 'react';
import type {
  OptionListProps as SelectOptionListProps,
  RefOptionListProps,
} from 'rc-select/lib/OptionList';
import { SelectContext } from 'rc-tree-select/lib/Context';
import type { OptionDataNode } from '../interface';
import Column from './Column';
import { restoreCompatibleValue } from '../util';
import SearchResult from './SearchResult';
import CascaderContext from '../context';

const RefOptionList = React.forwardRef<RefOptionListProps, SelectOptionListProps<OptionDataNode[]>>(
  (props, ref) => {
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
    } = props;

    const { checkedKeys, halfCheckedKeys } = React.useContext(SelectContext);
    const { changeOnSelect, expandTrigger, fieldNames, loadData } =
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

    const onPathSelect = (pathValue: React.Key, isLeaf: boolean) => {
      onSelect(pathValue, { selected: !checkedSet.has(pathValue) });

      if (!multiple && (isLeaf || (changeOnSelect && expandTrigger === 'hover'))) {
        onToggleOpen(false);
      }
    };

    const getPathList = (pathList: React.Key[]) => {
      let currentOptions = options;

      for (let i = 0; i < pathList.length; i += 1) {
        currentOptions = (currentOptions || []).find(
          option => option.value === pathList[i],
        ).children;
      }

      return currentOptions;
    };

    // ========================= Keyboard =========================
    React.useImperativeHandle(ref, () => ({
      // scrollTo: treeRef.current?.scrollTo,
      onKeyDown: event => {
        const { which } = event;
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

    // >>>>> Search
    if (searchValue) {
      return <SearchResult {...columnProps} />;
    }

    // >>>>> Columns
    const firstLevelOptions = options.length
      ? options
      : [
          {
            title: notFoundContent,
            value: '__EMPTY__',
            disabled: true,
            node: null,
          },
        ];

    const columnNodes: React.ReactElement[] = [
      <Column
        key={0}
        index={0}
        {...columnProps}
        options={firstLevelOptions}
        openKey={openPath[0]}
      />,
    ];

    openPath.forEach((_, index) => {
      const mergedIndex = index + 1;
      const subOptions = getPathList(openPath.slice(0, mergedIndex));

      if (subOptions) {
        columnNodes.push(
          <Column
            key={mergedIndex}
            index={mergedIndex}
            {...columnProps}
            options={subOptions}
            openKey={openPath[mergedIndex]}
          />,
        );
      }
    });

    // >>>>> Render
    return (
      <>
        <div className={`${prefixCls}-holder`}>{columnNodes}</div>
      </>
    );
  },
);

export default RefOptionList;
