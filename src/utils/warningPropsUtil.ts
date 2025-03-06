import warning from '@rc-component/util/lib/warning';
import type { DefaultOptionType, FieldNames } from '../Cascader';

// value in Cascader options should not be null
export function warningNullOptions(options: DefaultOptionType[], fieldNames: FieldNames) {
  if (options) {
    const recursiveOptions = (optionsList: DefaultOptionType[]) => {
      for (let i = 0; i < optionsList.length; i++) {
        const option = optionsList[i];

        if (option[fieldNames?.value as string] === null) {
          warning(false, '`value` in Cascader options should not be `null`.');
          return true;
        }

        if (
          Array.isArray(option[fieldNames?.children as string]) &&
          recursiveOptions(option[fieldNames?.children as string])
        ) {
          return true;
        }
      }
    };

    recursiveOptions(options);
  }
}
