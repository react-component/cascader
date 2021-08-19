import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import type { CascaderValueType, DataNode, OptionDataNode } from './interface';

export function restoreCompatibleValue(entity: FlattenDataNode): {
  path: CascaderValueType;
  options: DataNode[];
} {
  const path: CascaderValueType = [];
  const options: DataNode[] = [];

  let current = entity;

  while (current) {
    path.unshift(current.data.node.value);
    options.unshift(current.data.node as DataNode);

    current = current.parent;
  }

  return { path, options };
}

export function isLeaf(option: DataNode | OptionDataNode) {
  const { isLeaf: leaf, children } = option;
  return leaf !== undefined ? leaf : !children?.length;
}

/**
 * Fill options with fully value by path to avoid nest entity with same value.
 * This is slow perf on large list. We should abandon same value in nest in future.
 */
export function convertOptions(options: DataNode[]) {
  const split = '__RC_CASCADER_SPLIT__';

  function injectValue(list: DataNode[], parentValue = '') {
    return (list || []).map(option => {
      const newValue = [parentValue, option.value].join(split);
      const cloneOption = {
        ...option,
        value: newValue,
      };

      if (cloneOption.children) {
        cloneOption.children = injectValue(cloneOption.children, newValue);
      }

      return cloneOption;
    });
  }

  return injectValue(options);
}
