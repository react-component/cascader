import React from 'react';
import arrayTreeFilter from 'array-tree-filter';
import { findDOMNode } from 'react-dom';

class Menus extends React.Component {
  constructor(props) {
    super();
    const { value, defaultValue } = props;
    const initialValue = value || defaultValue || [];
    this.state = {
      activeValue: initialValue,
      value: initialValue,
    };
  }

  componentDidMount() {
    this.scrollActiveItemToView();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value || [],
      });
    }
    // sync activeValue with value when panel open
    if (nextProps.visible && !this.props.visible) {
      this.setState({
        activeValue: this.state.value,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scrollActiveItemToView();
    }
  }

  onSelect(targetOption, menuIndex) {
    if (!targetOption) {
      return;
    }
    let activeValue = this.state.activeValue;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption.value;
    const activeOptions = this.getActiveOptions(activeValue);
    if (targetOption.isLeaf === false && !targetOption.children) {
      if (this.props.loadData) {
        this.setState({activeValue});
        this.props.loadData(activeOptions);
      }
    } else if (!targetOption.children || !targetOption.children.length) {
      this.props.onChange(activeOptions);
      // finish select
      // should set value to activeValue
      this.setState({value: activeValue});
    } else {
      this.setState({activeValue});
    }
  }

  getOption(option, menuIndex) {
    const { prefixCls, expandTrigger } = this.props;
    const onSelect = this.onSelect.bind(this, option, menuIndex);
    let expandProps = {
      onClick: onSelect,
    };
    let menuItemCls = `${prefixCls}-menu-item`;
    if (expandTrigger === 'hover' &&
      option.children &&
      option.children.length > 0) {
      expandProps = {
        onMouseEnter: onSelect,
      };
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
    }
    if (this.isActiveOption(option)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
      expandProps.ref = 'activeItem' + menuIndex;
    }
    return (
      <li key={option.value}
          className={menuItemCls}
          title={option.label}
        {...expandProps}>
        {option.label}
      </li>
    );
  }

  getActiveOptions(values) {
    const activeValue = values || this.state.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options, (o, level) => o.value === activeValue[level]);
  }

  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  }

  scrollActiveItemToView() {
    // scroll into view
    const optionsLength = this.getShowOptions().length;
    for (let i = 0; i < optionsLength; i++) {
      const itemComponent = this.refs['activeItem' + i];
      if (itemComponent) {
        const target = findDOMNode(itemComponent);
        target.parentNode.scrollTop = target.offsetTop;
      }
    }
  }

  isActiveOption(option) {
    return this.state.activeValue.some(value => value === option.value);
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul className={`${prefixCls}-menu`} key={menuIndex}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        )}
      </div>
    );
  }
}

Menus.defaultProps = {
  options: [],
  onChange() {
  },
  onSelect() {
  },
  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click',
};

Menus.propTypes = {
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  expandTrigger: React.PropTypes.string,
  onChange: React.PropTypes.func,
  loadData: React.PropTypes.func,
  visible: React.PropTypes.bool,
};

export default Menus;
