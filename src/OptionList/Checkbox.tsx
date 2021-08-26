import * as React from 'react';
import classNames from 'classnames';
import { SelectContext } from 'rc-tree-select/lib/Context';

export interface CheckboxProps {
  prefixCls: string;
  checked?: boolean;
  halfChecked?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

export default function Checkbox({
  prefixCls,
  checked,
  halfChecked,
  disabled,
  onClick,
}: CheckboxProps) {
  const { checkable } = React.useContext(SelectContext);

  const customCheckbox = typeof checkable !== 'boolean' ? checkable : null;

  return (
    <span
      className={classNames(`${prefixCls}`, {
        [`${prefixCls}-checked`]: checked,
        [`${prefixCls}-indeterminate`]: !checked && halfChecked,
        [`${prefixCls}-disabled`]: disabled,
      })}
      onClick={onClick}
    >
      {customCheckbox}
    </span>
  );
}
