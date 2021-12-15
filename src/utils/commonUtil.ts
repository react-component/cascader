import type { DefaultOptionType, FieldNames } from '../Cascader';

export function fillFieldNames(fieldNames?: FieldNames): Required<FieldNames> {
  const { label, value, children } = fieldNames || {};
  return {
    label: label || 'label',
    value: value || 'value',
    children: children || 'children',
  };
}

export function isLeaf(option: DefaultOptionType, fieldNames: FieldNames) {
  if (option.isLeaf) {
    return true;
  }

  return !option[fieldNames.children];
}
