import generateSelector from 'rc-select/lib/generate';
import OptionList from './OptionList';
import type { DataNode } from './interface';
import {
  filterOptions,
  findValueOption,
  flattenOptions,
  getLabeledValue,
  isValueDisabled,
} from './utils';

const RefCascader = generateSelector<DataNode[]>({
  prefixCls: 'rc-cascader',
  components: {
    optionList: OptionList,
  },
  // No need to convert children
  convertChildrenToData: () => null,

  flattenOptions,

  // Handle `optionLabelProp` in TreeSelect component
  getLabeledValue,

  filterOptions,

  findValueOption,

  isValueDisabled,

  // omitDOMProps: (props: object) => {
  //   const cloneProps = { ...props };
  //   OMIT_PROPS.forEach((prop) => {
  //     delete cloneProps[prop];
  //   });
  //   return cloneProps;
  // },
});

RefCascader.displayName = 'Cascader';

export default RefCascader;
