import React from 'react';

class Menus extends React.Component {
  constructor(props) {
    const { value, defaultValue } = props;
    super();
    this.state = {
      activeValues: value || defaultValue || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        activeValues: nextProps.value,
      });
    }
  }
  getActiveOptions(values) {
    const activeValues = values || this.state.activeValues;
    let options = this.props.options;
    const result = [];
    activeValues.forEach(value => {
      const target = options.filter(o => o.value === value)[0];
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
    let activeValues = this.state.activeValues;
    activeValues = activeValues.slice(0, menuIndex + 1);
    activeValues[menuIndex] = targetOption.value;
    if (!('value' in this.props)) {
      this.setState({ activeValues });
    }
    const activeOptions = this.getActiveOptions(activeValues);
    this.props.onSelect(activeOptions);
    if (!targetOption.children || targetOption.children.length === 0) {
      this.props.onChange(activeOptions);
    }
  }
  isActiveOption(option) {
    return this.state.activeValues.some(value => value === option.value);
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
  onSelect() {},
  onChange() {},
  prefixCls: 'rc-cascader-menus',
};

Menus.propTypes = {
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  onChange: React.PropTypes.func,
};

export default Menus;
