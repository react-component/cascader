import * as React from 'react';
import type { DefaultOptionType, SingleValueType, FieldNames, CascaderProps } from '../Cascader';

const SPLIT = '__RC_CASCADER_SPLIT__';

export default (
  rawValues: SingleValueType[],
  options: DefaultOptionType[],
  fieldNames: FieldNames,
  displayRender: CascaderProps['displayRender'] = labels => labels.join(' / '),
) => {
  return React.useMemo(() => {
    return rawValues.map(valueCells => {
      let currentList = options;
      const valueOptions: {
        value: SingleValueType[number];
        option: DefaultOptionType;
      }[] = [];

      // Fill value with options
      for (let i = 0; i < valueCells.length; i += 1) {
        const valueCell = valueCells[i];
        const foundOption = currentList?.find(option => option[fieldNames.value] === valueCell);

        valueOptions.push({
          value: valueCell,
          option: foundOption,
        });

        currentList = foundOption?.[fieldNames.children];
      }

      const label = displayRender(
        valueOptions.map(({ option, value }) => option?.[fieldNames.label] ?? value),
        valueOptions.map(({ option }) => option),
      );

      return {
        label,
        value: valueCells.join(SPLIT),
      };
    });
  }, [rawValues, options, fieldNames, displayRender]);
};
