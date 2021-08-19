import type * as React from 'react';

export type CascaderValueType = React.Key[];

export interface DataNode {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  children?: DataNode[];
  isLeaf?: boolean;
}

export interface OptionDataNode extends Omit<DataNode, 'label' | 'children'> {
  title: React.ReactNode;
  children?: OptionDataNode[];
}
export interface FlattenDataNode {
  key: React.Key;
  data: DataNode;
  path: React.Key[];
  parent?: FlattenDataNode;
}
