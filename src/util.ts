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
