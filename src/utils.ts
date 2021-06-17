import type {
  FilterOptions,
  GetLabeledValue,
  RawValueType,
} from 'rc-select/lib/interface/generator';
import type { DataNode, FlattenDataNode } from './interface';

const KEY_SPLIT = '___RC_CASCADER__';

export function flattenOptions(options: DataNode[]): FlattenDataNode[] {
  const flattenList: FlattenDataNode[] = [];

  function dig(list: DataNode[] | undefined, parentKeys: React.Key[], parent?: FlattenDataNode) {
    (list || []).forEach((data) => {
      const pathKeys = [...parentKeys, data.value];
      const key = pathKeys.join(KEY_SPLIT);

      const flattenNode = {
        key,
        data,
        path: pathKeys,
        parent,
      };

      flattenList.push(flattenNode);

      dig(data.children, pathKeys, flattenNode);
    });
  }

  dig(options, []);

  return flattenList;
}

export const getLabeledValue: GetLabeledValue<FlattenDataNode[]> = (value, config) => {
  const { options, optionLabelProp } = config;

  const option = options.find((opt) => opt.data.value === value);
  return option
    ? {
        key: option.key,
        value: option.data.value,
        label: option.data[optionLabelProp],
      }
    : null;
};

export const filterOptions: FilterOptions<DataNode[]> = (
  searchValue,
  options,
  { filterOption, optionFilterProp },
) => {
  // TODO: do this
  return options;
};

export function findValueOption(values: RawValueType[], options: FlattenDataNode[]): DataNode[] {
  const optionMap: Map<RawValueType, DataNode> = new Map();

  options.forEach((flattenItem) => {
    const { data } = flattenItem;
    optionMap.set(data.value, data);
  });

  return values.map((val) => optionMap.get(val));
}

export function isValueDisabled(value: RawValueType, options: FlattenDataNode[]): boolean {
  const option = findValueOption([value], options)[0];
  if (option) {
    return option.disabled;
  }

  return false;
}
