import warning from 'rc-util/lib/warning';
import type { DefaultOptionType, FieldNames, InternalCascaderProps } from '../Cascader';

function warningProps(props: InternalCascaderProps) {
  const { onDropdownVisibleChange, dropdownClassName } = props;

  warning(
    !onDropdownVisibleChange,
    '`onDropdownVisibleChange` is deprecated. Please use `onPopupVisibleChange` instead.',
  );
  warning(
    dropdownClassName === undefined,
    '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
  );
}

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

export default warningProps;
