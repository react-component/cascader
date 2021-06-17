import * as React from 'react';
import type { OptionListProps, RefOptionListProps } from 'rc-select/lib/OptionList';
import List from 'rc-virtual-list';
import type { DataNode } from '../interface';
import Column from './Column';

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(
  (props, ref) => {
    const { prefixCls, options, values, onSelect, multiple } = props;
    console.log('>>>', props);

    const [openPath, setOpenPath] = React.useState<React.Key[]>(() => {
      if (!multiple && values.size) {
        const firstValue = Array.from(values.values())[0];

        // TODO: Back of path
        return [];
      }

      return [];
    });

    // =========================== Path ===========================
    const onPathClick = (index: number, pathValue: React.Key) => {
      const nextOpenPath = [...openPath.slice(0, index), pathValue];
      setOpenPath(nextOpenPath);

      onSelect(pathValue, { selected: true });
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
      onClick: onPathClick,
    };

    const columnNodes: React.ReactElement[] = [<Column key={0} index={0} {...columnProps} />];

    openPath.forEach((_, index) => {
      const mergedIndex = index + 1;
      const subOptions = getPathList(openPath.slice(0, mergedIndex));

      if (subOptions) {
        columnNodes.push(
          <Column key={mergedIndex} index={mergedIndex} {...columnProps} options={subOptions} />,
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
