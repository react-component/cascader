import React, { useEffect } from 'react';
import arrayTreeFilter from 'array-tree-filter';
import { RefOptionListProps } from 'rc-select/lib/OptionList';
import { CascaderOption, CascaderFieldNames } from './Cascader';

export interface OptionListProps {
  prefixCls?: string;
  value?: (string | number)[];
  activeValue?: (string | number)[];
  options?: CascaderOption[];
  expandTrigger?: string;
  visible?: boolean;
  dropdownMenuColumnStyle?: React.CSSProperties;
  defaultFieldNames?: CascaderFieldNames;
  fieldNames?: CascaderFieldNames;
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;

  onSelect?: (targetOption: string[], index: number, e: React.KeyboardEvent<HTMLElement>) => void;
  onItemDoubleClick?: (
    targetOption: string[],
    index: number,
    e: React.MouseEvent<HTMLElement>,
  ) => void;
}

interface MenuItems {
  [index: number]: HTMLLIElement;
}

const OptionList: React.RefForwardingComponent<RefOptionListProps, OptionListProps> = (
  props,
  ref,
) => {
  const menuItems: MenuItems = {};

  let delayTimer: number;
  const { prefixCls, dropdownMenuColumnStyle } = props;

  React.useImperativeHandle(ref, () => ({
    onKeyDown: () => {},
    onKeyUp: () => {},
    scrollTo: () => {},
  }));

  const getFieldName = name => {
    const { fieldNames, defaultFieldNames } = props;
    // 防止只设置单个属性的名字
    return fieldNames[name] || defaultFieldNames[name];
  };

  const getActiveOptions = (values?: CascaderOption[]): CascaderOption[] => {
    const { options } = props;
    const activeValue = values || props.activeValue;
    return arrayTreeFilter(options, (o, level) => o[getFieldName('value')] === activeValue[level], {
      childrenKeyName: getFieldName('children'),
    });
  };

  const getShowOptions = (): CascaderOption[][] => {
    const { options } = props;
    const result = getActiveOptions()
      .map(activeOption => activeOption[getFieldName('children')])
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  };

  const scrollActiveItemToView = () => {
    // scroll into view
    const optionsLength = getShowOptions().length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < optionsLength; i++) {
      const itemComponent = menuItems[i];
      if (itemComponent && itemComponent.parentElement) {
        itemComponent.parentElement.scrollTop = itemComponent.offsetTop;
      }
    }
  };

  useEffect(() => {
    scrollActiveItemToView();
  }, []);

  const delayOnSelect = (onSelect, ...args) => {
    if (delayTimer) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }
    if (typeof onSelect === 'function') {
      delayTimer = window.setTimeout(() => {
        onSelect(args);
        delayTimer = null;
      }, 150);
    }
  };

  const isActiveOption = (option, menuIndex) => {
    const { activeValue = [] } = props;
    return activeValue[menuIndex] === option[getFieldName('value')];
  };

  const saveMenuItem = index => node => {
    menuItems[index] = node;
  };

  const getOption = (option: CascaderOption, menuIndex: number) => {
    const { prefixCls, expandTrigger, expandIcon, loadingIcon } = props;
    const onSelect = props.onSelect.bind(this, option, menuIndex);
    const onItemDoubleClick = props.onItemDoubleClick.bind(this, option, menuIndex);
    let expandProps: any = {
      onClick: onSelect,
      onDoubleClick: onItemDoubleClick,
    };
    let menuItemCls = `${prefixCls}-menu-item`;
    let expandIconNode = null;
    const hasChildren =
      option[getFieldName('children')] && option[getFieldName('children')].length > 0;
    if (hasChildren || option.isLeaf === false) {
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
      if (!option.loading) {
        expandIconNode = <span className={`${prefixCls}-menu-item-expand-icon`}>{expandIcon}</span>;
      }
    }
    if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
      expandProps = {
        onMouseEnter: delayOnSelect.bind(this, onSelect),
        onMouseLeave: delayOnSelect.bind(this),
        onClick: onSelect,
      };
    }
    if (isActiveOption(option, menuIndex)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
      expandProps.ref = saveMenuItem(menuIndex);
    }
    if (option.disabled) {
      menuItemCls += ` ${prefixCls}-menu-item-disabled`;
    }

    let loadingIconNode = null;
    if (option.loading) {
      menuItemCls += ` ${prefixCls}-menu-item-loading`;
      loadingIconNode = loadingIcon || null;
    }

    let title = '';
    if ('title' in option) {
      // eslint-disable-next-line prefer-destructuring
      title = option.title;
    } else if (typeof option[getFieldName('label')] === 'string') {
      title = option[getFieldName('label')];
    }

    return (
      <li
        key={option[getFieldName('value')]}
        className={menuItemCls}
        title={title}
        {...expandProps}
        role="menuitem"
        onMouseDown={e => e.preventDefault()}
      >
        {option[getFieldName('label')]}
        {expandIconNode}
        {loadingIconNode}
      </li>
    );
  };

  return (
    <div>
      {getShowOptions().map((options, menuIndex) => (
        <ul className={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
          {options.map(option => getOption(option, menuIndex))}
        </ul>
      ))}
    </div>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
