import type * as React from 'react';

export type CascaderValueType = React.Key[];

export interface DataNode {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  children?: DataNode[];
}

export interface FlattenDataNode {
  key: React.Key;
  data: DataNode;
  path: React.Key[];
  parent?: FlattenDataNode;
}
