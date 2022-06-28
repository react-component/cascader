import warning from 'rc-util/lib/warning';
import type { DefaultOptionType, FieldNames, InternalCascaderProps } from '../Cascader';

function warningProps(props: InternalCascaderProps) {
  const { onPopupVisibleChange, popupVisible, popupClassName, popupPlacement } = props;

  warning(
    !onPopupVisibleChange,
    '`onPopupVisibleChange` is deprecated. Please use `onDropdownVisibleChange` instead.',
  );
  warning(popupVisible === undefined, '`popupVisible` is deprecated. Please use `open` instead.');
  warning(
    popupClassName === undefined,
    '`popupClassName` is deprecated. Please use `dropdownClassName` instead.',
  );
  warning(
    popupPlacement === undefined,
    '`popupPlacement` is deprecated. Please use `placement` instead.',
  );
}

// value in Cascader options should not be null
export function warningNullOptions(options: DefaultOptionType[], fieldNames: FieldNames) {
  if (options) {
    const recursiveOptions = (optionsList: DefaultOptionType[]) => {
      for (let i = 0; i < optionsList.length; i++) {
        const option = optionsList[i];

        if (option[fieldNames?.value] === null) {
          warning(false, '`value` in Cascader options should not be `null`.');
          return true;
        }

        if (
          Array.isArray(option[fieldNames?.children]) &&
          recursiveOptions(option[fieldNames?.children])
        ) {
          return true;
        }
      }
    };

    recursiveOptions(options);
  }
}

export default warningProps;
