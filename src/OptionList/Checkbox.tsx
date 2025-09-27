import * as React from 'react';
import { clsx } from 'clsx';
import CascaderContext from '../context';

export interface CheckboxProps {
  prefixCls: string;
  checked?: boolean;
  halfChecked?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  disableCheckbox?: boolean;
}

export default function Checkbox({
  prefixCls,
  checked,
  halfChecked,
  disabled,
  onClick,
  disableCheckbox,
}: CheckboxProps) {
  const { checkable } = React.useContext(CascaderContext);

  const customCheckbox = typeof checkable !== 'boolean' ? checkable : null;

  return (
    <span
      className={clsx(`${prefixCls}`, {
        [`${prefixCls}-checked`]: checked,
        [`${prefixCls}-indeterminate`]: !checked && halfChecked,
        [`${prefixCls}-disabled`]: disabled || disableCheckbox,
      })}
      onClick={onClick}
    >
      {customCheckbox}
    </span>
  );
}
