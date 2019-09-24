import React from 'react';
import PropTypes from 'prop-types';
import arrayTreeFilter from 'array-tree-filter';
import { findDOMNode } from 'react-dom';

class Menus extends React.Component {
  constructor(props) {
    super(props);

    this.menuItems = {};
  }

  componentDidMount() {
    this.scrollActiveItemToView();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scrollActiveItemToView();
    }
  }
  getFieldName(name) {
    const { fieldNames, defaultFieldNames } = this.props;
    // 防止只设置单个属性的名字
    return fieldNames[name] || defaultFieldNames[name];
  }
  getOption(option, menuIndex) {
    const { prefixCls, expandTrigger, expandIcon, loadingIcon } = this.props;
    const onSelect = this.props.onSelect.bind(this, option, menuIndex);
    const onItemDoubleClick = this.props.onItemDoubleClick.bind(this, option, menuIndex);
    let expandProps = {
      onClick: onSelect,
      onDoubleClick: onItemDoubleClick,
    };
    let menuItemCls = `${prefixCls}-menu-item`;
    let expandIconNode = null;
    const hasChildren =
      option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
    if (hasChildren || option.isLeaf === false) {
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
      if (!option.loading) {
        expandIconNode = <span className={`${prefixCls}-menu-item-expand-icon`}>{expandIcon}</span>;
      }
    }
    if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
      expandProps = {
        onMouseEnter: this.delayOnSelect.bind(this, onSelect),
        onMouseLeave: this.delayOnSelect.bind(this),
        onClick: onSelect,
      };
    }
    if (this.isActiveOption(option, menuIndex)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
      expandProps.ref = this.saveMenuItem(menuIndex);
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
      title = option.title;
    } else if (typeof option[this.getFieldName('label')] === 'string') {
      title = option[this.getFieldName('label')];
    }

    return (
      <li
        key={option[this.getFieldName('value')]}
        className={menuItemCls}
        title={title}
        {...expandProps}
        role="menuitem"
        onMouseDown={e => e.preventDefault()}
      >
        {option[this.getFieldName('label')]}
        {expandIconNode}
        {loadingIconNode}
      </li>
    );
  }

  getActiveOptions(values) {
    const activeValue = values || this.props.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(
      options,
      (o, level) => o[this.getFieldName('value')] === activeValue[level],
      { childrenKeyName: this.getFieldName('children') },
    );
  }

  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption[this.getFieldName('children')])
      .filter(activeOption => {
        return !!activeOption && Array.isArray(activeOption) && activeOption.length > 0;
      });
    result.unshift(options);
    return result;
  }

  delayOnSelect(onSelect, ...args) {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (typeof onSelect === 'function') {
      this.delayTimer = setTimeout(() => {
        onSelect(args);
        this.delayTimer = null;
      }, 150);
    }
  }

  scrollActiveItemToView() {
    // scroll into view
    const optionsLength = this.getShowOptions().length;
    for (let i = 0; i < optionsLength; i++) {
      const itemComponent = this.menuItems[i];
      if (itemComponent) {
        const target = findDOMNode(itemComponent);
        target.parentNode.scrollTop = target.offsetTop;
      }
    }
  }

  isActiveOption(option, menuIndex) {
    const { activeValue = [] } = this.props;
    return activeValue[menuIndex] === option[this.getFieldName('value')];
  }

  saveMenuItem = index => node => {
    this.menuItems[index] = node;
  };

  render() {
    const { prefixCls, dropdownMenuColumnStyle } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) => (
          <ul className={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        ))}
      </div>
    );
  }
}

Menus.defaultProps = {
  options: [],
  value: [],
  activeValue: [],
  onSelect() {},
  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click',
};

Menus.propTypes = {
  value: PropTypes.array,
  activeValue: PropTypes.array,
  options: PropTypes.array,
  prefixCls: PropTypes.string,
  expandTrigger: PropTypes.string,
  onSelect: PropTypes.func,
  visible: PropTypes.bool,
  dropdownMenuColumnStyle: PropTypes.object,
  defaultFieldNames: PropTypes.object,
  fieldNames: PropTypes.object,
  expandIcon: PropTypes.node,
  loadingIcon: PropTypes.node,
  onItemDoubleClick: PropTypes.func,
};

export default Menus;
