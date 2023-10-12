import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import type { ShowCheckedStrategy, SingleValueType, ValueType } from '../Cascader';
import { toPathKey, toPathKeys } from '../utils/commonUtil';
import { formatStrategyValues } from '../utils/treeUtil';
import type { GetEntities } from './useEntities';

export default function useSelect(
  multiple: boolean,
  triggerChange: (nextValues: ValueType) => void,
  checkedValues: SingleValueType[],
  halfCheckedValues: SingleValueType[],
  missingCheckedValues: SingleValueType[],
  getPathKeyEntities: GetEntities,
  getValueByKeyPath: (pathKeys: React.Key[]) => SingleValueType[],
  showCheckedStrategy: ShowCheckedStrategy,
) {
  return (valuePath: SingleValueType) => {
    if (!multiple) {
      triggerChange(valuePath);
    } else {
      // Prepare conduct required info
      const pathKey = toPathKey(valuePath);
      const checkedPathKeys = toPathKeys(checkedValues);
      const halfCheckedPathKeys = toPathKeys(halfCheckedValues);

      const existInChecked = checkedPathKeys.includes(pathKey);
      const existInMissing = missingCheckedValues.some(
        valueCells => toPathKey(valueCells) === pathKey,
      );

      // Do update
      let nextCheckedValues = checkedValues;
      let nextMissingValues = missingCheckedValues;

      if (existInMissing && !existInChecked) {
        // Missing value only do filter
        nextMissingValues = missingCheckedValues.filter(
          valueCells => toPathKey(valueCells) !== pathKey,
        );
      } else {
        // Update checked key first
        const nextRawCheckedKeys = existInChecked
          ? checkedPathKeys.filter(key => key !== pathKey)
          : [...checkedPathKeys, pathKey];

        const pathKeyEntities = getPathKeyEntities();

        // Conduction by selected or not
        let checkedKeys: React.Key[];
        if (existInChecked) {
          ({ checkedKeys } = conductCheck(
            nextRawCheckedKeys,
            { checked: false, halfCheckedKeys: halfCheckedPathKeys },
            pathKeyEntities,
          ));
        } else {
          ({ checkedKeys } = conductCheck(nextRawCheckedKeys, true, pathKeyEntities));
        }

        // Roll up to parent level keys
        const deDuplicatedKeys = formatStrategyValues(
          checkedKeys,
          getPathKeyEntities,
          showCheckedStrategy,
        );
        nextCheckedValues = getValueByKeyPath(deDuplicatedKeys);
      }

      triggerChange([...nextMissingValues, ...nextCheckedValues]);
    }
  };
}
