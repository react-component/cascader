import * as React from 'react';
import type { OptionListProps, RefOptionListProps } from 'rc-select/lib/OptionList';
import { SelectContext } from 'rc-tree-select/lib/Context';
import List from 'rc-virtual-list';
import type { DataNode } from '../interface';
import Column from './Column';
import CascaderContext from '../context';

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(
  (props, ref) => {
    const { changeOnSelect } = React.useContext(CascaderContext);
    const { prefixCls, options, onSelect, multiple } = props;

    const { checkedKeys, halfCheckedKeys } = React.useContext(SelectContext);
    // console.log('OptionList Props:', props, checkedKeys);
    console.log('OptionList CheckedKeys:', checkedKeys);

    // ========================== Values ==========================
    const checkedSet = React.useMemo(() => new Set(checkedKeys), [checkedKeys]);
    const halfCheckedSet = React.useMemo(() => new Set(halfCheckedKeys), [halfCheckedKeys]);

    // =========================== Open ===========================
    const [openPath, setOpenPath] = React.useState<React.Key[]>(() => {
      if (!multiple && checkedSet.size) {
        const firstValue = Array.from(checkedSet.values())[0];

        // TODO: Back of path
        return [];
      }

      return [];
    });

    // =========================== Path ===========================
    const onPathOpen = (index: number, pathValue: React.Key) => {
      const nextOpenPath = [...openPath.slice(0, index), pathValue];
      setOpenPath(nextOpenPath);
    };

    const onPathSelect = (pathValue: React.Key) => {
      onSelect(pathValue, { selected: !checkedSet.has(pathValue) });
    };

    const getPathList = (pathList: React.Key[]) => {
      let currentOptions = options;

      for (let i = 0; i < pathList.length; i += 1) {
        currentOptions = (currentOptions || []).find(
          (option) => option.value === pathList[i],
        ).children;
      }

      return currentOptions;
    };

    // ========================= Keyboard =========================
    React.useImperativeHandle(ref, () => ({} as any));

    // ========================== Render ==========================
    // >>>>> Columns
    const columnProps = {
      ...props,
      onOpen: onPathOpen,
      onSelect: onPathSelect,
      checkedSet,
      halfCheckedSet,
      changeOnSelect,
    };

    const columnNodes: React.ReactElement[] = [
      <Column key={0} index={0} {...columnProps} openKey={openPath[0]} />,
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
