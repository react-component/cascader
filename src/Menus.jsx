import React from 'react';

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
        activeValue: nextProps.value || [],
        value: nextProps.value || [],
      });
    }
    if (!nextProps.visible) {
      this.setState({
        activeValue: this.state.value,
      });
    }
  }
  getActiveOptions(values) {
    const activeValue = values || this.state.activeValue;
    let options = this.props.options;
    const result = [];
    activeValue.forEach(value => {
      const target = options.find(o => o.value === value);
      if (!target) {
        return false;
      }
      result.push(target);
      options = target.children || [];
    });
    return result;
  }
  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  }
  handleClick(targetOption, menuIndex) {
    if (!targetOption) {
      return;
    }
    let activeValue = this.state.activeValue;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption.value;
    const activeOptions = this.getActiveOptions(activeValue);
    const newState = { activeValue };
    if (!targetOption.children || targetOption.children.length === 0) {
      this.props.onChange(activeOptions);
      newState.value = activeValue;
    }
    this.setState(newState);
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
            {options.map(option => {
              let menuItemCls = `${prefixCls}-menu-item`;
              if (this.isActiveOption(option)) {
                menuItemCls += ` ${prefixCls}-menu-item-active`;
              }
              return (
                <li key={option.value}
                  className={menuItemCls}
                  onClick={this.handleClick.bind(this, option, menuIndex)}>
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

Menus.defaultProps = {
  options: [],
  onChange() {},
  prefixCls: 'rc-cascader-menus',
  visible: false,
};

Menus.propTypes = {
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  onChange: React.PropTypes.func,
  visible: React.PropTypes.bool,
};

export default Menus;
