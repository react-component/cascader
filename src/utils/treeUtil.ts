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
