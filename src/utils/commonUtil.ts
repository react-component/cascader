import type { DefaultOptionType, FieldNames, InternalFieldNames } from '../Cascader';

export const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';

export function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, children } = fieldNames || {};
  const val = value || 'value';
  return {
    label: label || 'label',
    value: val,
    key: val,
    children: children || 'children',
  };
}

export function isLeaf(option: DefaultOptionType, fieldNames: FieldNames) {
  if (option.isLeaf) {
    return true;
  }

  return !option[fieldNames.children];
}
