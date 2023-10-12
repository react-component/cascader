import type { DataEntity } from 'rc-tree/lib/interface';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import * as React from 'react';
import type { SingleValueType } from '../Cascader';
import { toPathKeys } from '../utils/commonUtil';
import type { GetMissValues } from './useMissingValues';

export default function useValues(
  multiple: boolean,
  rawValues: SingleValueType[],
  getPathKeyEntities: () => Record<string, DataEntity>,
  getValueByKeyPath: (pathKeys: React.Key[]) => SingleValueType[],
  getMissingValues: GetMissValues,
): [
  checkedValues: SingleValueType[],
  halfCheckedValues: SingleValueType[],
  missingCheckedValues: SingleValueType[],
] {
  // Fill `rawValues` with checked conduction values
  return React.useMemo(() => {
    const [existValues, missingValues] = getMissingValues(rawValues);

    if (!multiple || !rawValues.length) {
      return [existValues, [], missingValues];
    }

    const keyPathValues = toPathKeys(existValues);
    const keyPathEntities = getPathKeyEntities();

    const { checkedKeys, halfCheckedKeys } = conductCheck(keyPathValues, true, keyPathEntities);

    // Convert key back to value cells
    return [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys), missingValues];
  }, [multiple, rawValues, getPathKeyEntities, getValueByKeyPath, getMissingValues]);
}
