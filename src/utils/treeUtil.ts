import type { SingleValueType, DefaultOptionType, InternalFieldNames } from '../Cascader';
import type { GetEntities } from '../hooks/useEntities';

export function formatStrategyValues(pathKeys: React.Key[], getKeyPathEntities: GetEntities) {
  const valueSet = new Set(pathKeys);
  const keyPathEntities = getKeyPathEntities();

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
) {
  let currentList = options;
  const valueOptions: {
    value: SingleValueType[number];
    option: DefaultOptionType;
  }[] = [];

  for (let i = 0; i < valueCells.length; i += 1) {
    const valueCell = valueCells[i];
    const foundOption = currentList?.find(option => option[fieldNames.value] === valueCell);

    valueOptions.push({
      value: valueCell,
      option: foundOption,
    });

    currentList = foundOption?.[fieldNames.children];
  }

  return valueOptions;
}