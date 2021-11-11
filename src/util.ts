import type { FlattenDataNode } from 'rc-tree-select/lib/interface';
import { fillFieldNames } from 'rc-tree-select/lib/utils/valueUtil';
import type {
  CascaderValueType,
  DataNode,
  FieldNames,
  InternalDataNode,
  OptionDataNode,
} from './interface';

const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';

export { fillFieldNames };

/**
 * Convert entity back to path & options
 * @returns
 */
export function restoreCompatibleValue(
  entity: FlattenDataNode,
  fieldNames: FieldNames,
): {
  path: CascaderValueType;
  options: InternalDataNode[];
} {
  const path: CascaderValueType = [];
  const options: InternalDataNode[] = [];

  let current = entity;

  while (current) {
    path.unshift(current.data.node[fieldNames.value]);
    options.unshift(current.data.node as any as InternalDataNode);

    current = current.parent;
  }

  return { path, options };
}

export function isLeaf(option: OptionDataNode) {
  const { children, node } = option;

  const leaf = node?.isLeaf;

  return leaf !== undefined ? leaf : !children?.length;
}

/**
 * We will connect path value to a string. e.g.
 * ['little', 'bamboo'] => 'little__bamboo'
 *
 * zombieJ: It's better to deprecate the same key in the nest tree. Maybe next major version.
 */
export function connectValue(value: React.Key[]) {
  return (value || []).join(VALUE_SPLIT);
}

/**
 * Reverse of `connectValue`
 */
export function splitValue(str: string) {
  return str.split(VALUE_SPLIT);
}

/**
 * Fill options with fully value by path to avoid nest entity with same value.
 * Which means we need another round to get origin node back!
 * This is slow perf on large list. We should abandon same value in nest in future.
 */
export function convertOptions(
  options: DataNode[],
  { value: fieldValue, children: fieldChildren }: FieldNames,
  internalValueField: string,
): InternalDataNode[] {
  function injectValue(list: DataNode[], parentValue = ''): InternalDataNode[] {
    return (list || []).map(option => {
      let newValue = option[fieldValue];
      if (parentValue) {
        newValue = connectValue([parentValue, option[fieldValue]]);
      } else if (typeof newValue === 'number') {
        // Since we will convert all the value to string, we need get this
        newValue = String(newValue);
      }

      const cloneOption = {
        ...option,
        [internalValueField]: newValue,
        node: option,
      };

      if (cloneOption[fieldChildren]) {
        cloneOption[fieldChildren] = injectValue(cloneOption[fieldChildren], newValue);
      }

      return cloneOption;
    });
  }

  return injectValue(options);
}
