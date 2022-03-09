import type {
  SingleValueType,
  DefaultOptionType,
  InternalFieldNames,
  ShowCheckedStrategy,
} from '../Cascader';
import type { GetEntities } from '../hooks/useEntities';

export function formatStrategyValues(
  pathKeys: React.Key[],
  getKeyPathEntities: GetEntities,
  showCheckedStrategy: ShowCheckedStrategy,
) {
  const valueSet = new Set(pathKeys);
  const keyPathEntities = getKeyPathEntities();

  if (showCheckedStrategy === 'child') {
    return pathKeys.filter(key => {
      const entity = keyPathEntities[key];
      const children = entity ? entity.children : null;
      if (children && children.find(child => child.key && valueSet.has(child.key))) {
        return false;
      }
      return true;
    });
  }

  return pathKeys.filter(key => {
    const entity = keyPathEntities[key];
    const parent = entity ? entity.parent : null;

    if (parent && !parent.node.disabled && valueSet.has(parent.key)) {
      return false;
    }
    return true;
  });
}

export function toPathOptions(
  valueCells: SingleValueType,
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  // Used for loadingKeys which saved loaded keys as string
  stringMode = false,
) {
  let currentList = options;
  const valueOptions: {
    value: SingleValueType[number];
    index: number;
    option: DefaultOptionType;
  }[] = [];

  for (let i = 0; i < valueCells.length; i += 1) {
    const valueCell = valueCells[i];
    const foundIndex = currentList?.findIndex(option => {
      const val = option[fieldNames.value];
      return stringMode ? String(val) === String(valueCell) : val === valueCell;
    });
    const foundOption = foundIndex !== -1 ? currentList?.[foundIndex] : null;

    valueOptions.push({
      value: foundOption?.[fieldNames.value] ?? valueCell,
      index: foundIndex,
      option: foundOption,
    });

    currentList = foundOption?.[fieldNames.children];
  }

  return valueOptions;
}
