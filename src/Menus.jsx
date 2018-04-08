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

  getOption(option, menuIndex) {
    const { prefixCls, expandTrigger, valueField, labelField } = this.props;
    const onSelect = this.props.onSelect.bind(this, option, menuIndex);
    let expandProps = {
      onClick: onSelect,
    };
    let menuItemCls = `${prefixCls}-menu-item`;
    const hasChildren = option.children && option.children.length > 0;
    if (hasChildren || option.isLeaf === false) {
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
    }
    if (expandTrigger === 'hover' && hasChildren) {
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
    if (option.loading) {
      menuItemCls += ` ${prefixCls}-menu-item-loading`;
    }
    let title = '';
    if (option.title) {
      title = option.title;
    } else if (typeof option[labelField] === 'string') {
      title = option[labelField];
    }
    return (
      <li
        key={option[valueField]}
        className={menuItemCls}
        title={title}
        {...expandProps}
      >
        {option[labelField]}
      </li>
    );
  }

  getActiveOptions(values) {
    const { valueField } = this.props;
    const activeValue = values || this.props.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options, (o, level) => o[valueField] === activeValue[level]);
  }

  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption);
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
    const { activeValue = [], valueField } = this.props;
    return activeValue[menuIndex] === option[valueField];
  }

  saveMenuItem = (index) => (node) => {
    this.menuItems[index] = node;
  }

  render() {
    const { prefixCls, dropdownMenuColumnStyle } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul className={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        )}
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
  options: PropTypes.array.isRequired,
  prefixCls: PropTypes.string,
  expandTrigger: PropTypes.string,
  onSelect: PropTypes.func,
  visible: PropTypes.bool,
  dropdownMenuColumnStyle: PropTypes.object,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
};

export default Menus;
