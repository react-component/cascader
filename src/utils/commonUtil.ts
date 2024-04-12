import type {
  DefaultOptionType,
  FieldNames,
  InternalFieldNames,
  InternalValueType,
  SingleValueType,
} from '../Cascader';
import { SEARCH_MARK } from '../hooks/useSearchOptions';

export const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';

/**
 * Will convert value to string, and join with `VALUE_SPLIT`
 */
export function toPathKey(value: SingleValueType) {
  return value.join(VALUE_SPLIT);
}

/**
 * Batch convert value to string, and join with `VALUE_SPLIT`
 */
export function toPathKeys(value: SingleValueType[]) {
  return value.map(toPathKey);
}

export function toPathValueStr(pathKey: string) {
  return pathKey.split(VALUE_SPLIT);
}

export function fillFieldNames(fieldNames?: FieldNames): InternalFieldNames {
  const { label, value, children } = fieldNames || {};
  const val = value || 'value';
  return {
    label: label || 'label',
    value: val,
    key: val as string,
    children: children || 'children',
  };
}

export function isLeaf(option: DefaultOptionType, fieldNames: FieldNames) {
  return option.isLeaf ?? !option[fieldNames.children as string]?.length;
}

export function scrollIntoParentView(element: HTMLElement) {
  const parent = element.parentElement;
  if (!parent) {
    return;
  }

  const elementToParent = element.offsetTop - parent.offsetTop; // offsetParent may not be parent.
  if (elementToParent - parent.scrollTop < 0) {
    parent.scrollTo({ top: elementToParent });
  } else if (elementToParent + element.offsetHeight - parent.scrollTop > parent.offsetHeight) {
    parent.scrollTo({ top: elementToParent + element.offsetHeight - parent.offsetHeight });
  }
}

export function getFullPathKeys(options: DefaultOptionType[], fieldNames: FieldNames) {
  return options.map(item =>
    item[SEARCH_MARK]?.map((opt: Record<string, any>) => opt[fieldNames.value as string]),
  );
}

function isMultipleValue(value: InternalValueType): value is SingleValueType[] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

export function toRawValues(value?: InternalValueType): SingleValueType[] {
  if (!value) {
    return [];
  }

  if (isMultipleValue(value)) {
    return value;
  }

  return (value.length === 0 ? [] : [value]).map(val => (Array.isArray(val) ? val : [val]));
}
