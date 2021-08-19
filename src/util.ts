import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import type { CascaderValueType, DataNode, InternalDataNode, OptionDataNode } from './interface';

const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';

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
 * We will connect path value to a string. e.g.
 * ['little', 'bamboo'] => 'little__bamboo'
 */
export function connectValue(value: React.Key[]) {
  return (value || []).join(VALUE_SPLIT);
}

/**
 * Fill options with fully value by path to avoid nest entity with same value.
 * Which means we need another round to get origin node back!
 * This is slow perf on large list. We should abandon same value in nest in future.
 */
export function convertOptions(options: DataNode[]): InternalDataNode[] {
  function injectValue(list: DataNode[], parentValue = ''): InternalDataNode[] {
    return (list || []).map(option => {
      const newValue = parentValue ? connectValue([parentValue, option.value]) : option.value;
      const cloneOption = {
        ...option,
        value: newValue,
        node: option,
      };

      if (cloneOption.children) {
        cloneOption.children = injectValue(cloneOption.children, newValue);
      }

      return cloneOption;
    });
  }

  return injectValue(options);
}
