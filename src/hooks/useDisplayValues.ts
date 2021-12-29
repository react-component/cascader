import { toPathOptions } from '../utils/treeUtil';
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
  displayRender: CascaderProps['displayRender'] = labels => {
    const SPLIT = ' / ';

    if (labels.every(label => ['string', 'number'].includes(typeof label))) {
      return labels.join(SPLIT);
    }

    // If exist non-string value, use ReactNode instead
    return labels.reduce((list, label, index) => {
      if (index === 0) {
        return [label];
      }

      return [...list, SPLIT, label];
    }, []);
  },
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
        valueCells,
      };
    });
  }, [rawValues, options, fieldNames, displayRender]);
};
