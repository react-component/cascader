import * as React from 'react';
import type { DefaultOptionType, InternalFieldNames, SingleValueType } from '../Cascader';
import { toPathOptions } from '../utils/treeUtil';

export type GetMissValues = ReturnType<typeof useMissingValues>;

export default function useMissingValues(
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
) {
  return React.useCallback(
    (rawValues: SingleValueType[]): [SingleValueType[], SingleValueType[]] => {
      const missingValues: SingleValueType[] = [];
      const existsValues: SingleValueType[] = [];

      rawValues.forEach(valueCell => {
        const pathOptions = toPathOptions(valueCell, options, fieldNames);
        if (pathOptions.every(opt => opt.option)) {
          existsValues.push(valueCell);
        } else {
          missingValues.push(valueCell);
        }
      });

      return [existsValues, missingValues];
    },
    [options, fieldNames],
  );
}
