import React from 'react';

class Menus extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeValues: props.values || props.defaultValues || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('values' in nextProps) {
      this.setState({
        activeValues: nextProps.values,
      });
    }
  }
  handleClick(targetOption, menuIndex) {
    if (!targetOption) {
      return;
    }
    let activeValues = this.state.activeValues;
    activeValues = activeValues.slice(0, menuIndex + 1);
    activeValues[menuIndex] = targetOption.value;
    if (!('values' in this.props)) {
      this.setState({ activeValues });
    }
    const activeOptions = this.getActiveOptions(activeValues);
    this.props.onSelect(activeOptions);
    if (!targetOption.options || targetOption.options.length === 0) {
      this.props.onChange(activeOptions);
    }
  }
  getActiveOptions(activeValues) {
    activeValues = activeValues || this.state.activeValues;
    let options = this.props.options;
    let result = [];
    activeValues.forEach(value => {
      const target = options.filter(o => o.value === value)[0];
      if (!target) {
        return false;
      }
      result.push(target);
      options = target.options || [];
    });
    return result;
  }
  getShowOptions() {
    let { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.options)
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
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
              return <li key={option.value}
                  className={menuItemCls}
                  onClick={this.handleClick.bind(this, option, menuIndex)}>
                {option.label}
              </li>;
            })}
          </ul>
        )}
      </div>
    );
  }
};

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
