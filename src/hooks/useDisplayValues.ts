import { toPathOptions } from '@/utils/treeUtil';
import * as React from 'react';
import type {
  DefaultOptionType,
  SingleValueType,
  CascaderProps,
  InternalFieldNames,
} from '../Cascader';
import { toPathKey } from '../utils/commonUtil';

export default (
  rawValues: SingleValueType[],
  options: DefaultOptionType[],
  fieldNames: InternalFieldNames,
  displayRender: CascaderProps['displayRender'] = labels => labels.join(' / '),
) => {
  return React.useMemo(() => {
    return rawValues.map(valueCells => {
      const valueOptions = toPathOptions(valueCells, options, fieldNames);

      const label = displayRender(
        valueOptions.map(({ option, value }) => option?.[fieldNames.label] ?? value),
        valueOptions.map(({ option }) => option),
      );

      return {
        label,
        value: toPathKey(valueCells),
      };
    });
  }, [rawValues, options, fieldNames, displayRender]);
};
