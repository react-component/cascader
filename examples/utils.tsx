export interface Option {
  code?: string;
  name?: string;
  nodes?: Option[];
  disabled?: boolean;
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
}
