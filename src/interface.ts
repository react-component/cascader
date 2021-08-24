import type * as React from 'react';

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}

export type CascaderValueType = React.Key[];

export interface DataNode {
  label: React.ReactNode;
  /** Customize hover title */
  title?: string;
  value: string;
  disabled?: boolean;
  children?: DataNode[];
  isLeaf?: boolean;
}

export interface InternalDataNode extends DataNode {
  node: DataNode;
}

export interface OptionDataNode extends Omit<InternalDataNode, 'label' | 'children' | 'title'> {
  title: React.ReactNode;
  children?: OptionDataNode[];
}
export interface FlattenDataNode {
  key: React.Key;
  data: DataNode;
  path: React.Key[];
  parent?: FlattenDataNode;
}

export interface ShowSearchType {
  filter?: (inputValue: string, options: DataNode[], fieldNames: FieldNames) => boolean;
  render?: (
    inputValue: string,
    path: DataNode[],
    prefixCls: string,
    fieldNames: FieldNames,
  ) => React.ReactNode;
  sort?: (
    a: DataNode[],
    b: DataNode[],
    inputValue: string,
    fieldNames: FieldNames,
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}
