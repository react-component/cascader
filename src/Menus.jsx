import React from 'react';
import arrayTreeFilter from 'array-tree-filter';

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
    let menuItemCls = `${prefixCls}-menu-item`;
    if (this.isActiveOption(option)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
    }
    const onSelect = this.onSelect.bind(this, option, menuIndex);
    let expandProps = {
      onClick: onSelect,
    };
    if (expandTrigger === 'hover' &&
      option.children &&
      option.children.length > 0) {
      expandProps = {
        onMouseEnter: onSelect,
      };
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
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

  isActiveOption(option) {
    return this.state.activeValue.some(value => value === option.value);
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
        <ul className={`${prefixCls}-menu`} key={menuIndex}>
          {
            options.map(option => {
              return this.getOption(option, menuIndex);
            })
            }
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
