export interface Option {
  code?: string;
  name?: string;
  nodes?: Option[];
  disabled?: boolean;
  [key: string]: any;
}

export interface Option2 {
  value?: string;
  label?: React.ReactNode;
  title?: React.ReactNode;
  disabled?: boolean;
  disableCheckbox?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: Option2[];
  [key: string]: any;
}
