import type { GetEntities } from '../hooks/useEntities';

export function formatStrategyValues(values: React.Key[], getKeyPathEntities: GetEntities) {
  const valueSet = new Set(values);
  const keyPathEntities = getKeyPathEntities();

  return values.filter(key => {
    const entity = keyPathEntities[key];
    const parent = entity ? entity.parent : null;

    if (parent && !parent.node.disabled && valueSet.has(parent.key)) {
      return false;
    }
    return true;
  });
}
